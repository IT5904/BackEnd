import Paging from '@core/utils/paging';
import { Client } from '@elastic/elasticsearch';
import { CollectionEntity, NftEntity } from '@entities/postgres-entities';
import { EntityRepository, getRepository } from 'typeorm';
import fs from 'fs';

const client = new Client({
  node: process.env.ELK_NODE,
  auth: {
    username: process.env.ELK_USER,
    password: process.env.ELK_PASS,
  },
  tls: {
    ca: fs.readFileSync('src/repositories/elasticsearch/cert/cert.crt'),
    rejectUnauthorized: false,
  },
});

@EntityRepository()
export class ElasticsearchRepository {
  async migrateCollection(): Promise<any> {
    const dataCollection = await getRepository(CollectionEntity)
      .createQueryBuilder('c')
      .select(
        `
        c.logo,
        c.name,
        c.address,
        c.total_items,
        c.created_at
      `,
      )
      .where('c.status != -1')
      .getRawMany();

    for (let i = 0; i < dataCollection.length; i++) {
      const element = dataCollection[i];
      await client.index({
        index: 'collection',
        body: {
          ...element,
        },
      });
    }

    await client.indices.refresh({ index: 'collection' });
    return true;
  }

  async migrateNFT(page = 1, limit = 100): Promise<any> {
    console.log('Migrate run: ', page, limit);

    const paging = Paging(page, limit);
    const dataNFT = await getRepository(NftEntity)
      .createQueryBuilder('n')
      .select(
        `
          n.image_url,
          n.title,
          n.nft_address,
          n.created_at,
          (select c."name" from collections c where c.address = n.collection_address) as collection_name
        `,
      )
      .offset(paging.skip)
      .limit(paging.take)
      .getRawMany();

    for (let i = 0; i < dataNFT.length; i++) {
      const element = dataNFT[i];
      await client.index({
        index: 'nft',
        body: {
          ...element,
        },
      });
    }

    await client.indices.refresh({ index: 'nft' });
    if (dataNFT.length == limit && page <= 10) {
      await this.migrateNFT(page + 1, limit);
    }
    return true;
  }

  async deleteIndex(): Promise<any> {
    await client.indices.delete({ index: 'collection' });
    await client.indices.delete({ index: 'nft' });
    return true;
  }

  async searchCollection(filter): Promise<any> {
    const res = await client.search({
      index: 'collection',
      body: {
        size: 10,
        _source: ['name', 'address', 'logo', 'total_items', 'created_at'],
        query: {
          bool: {
            should: [
              {
                regexp: {
                  'name.keyword': {
                    value: `.*${filter}.*`,
                    flags: 'ALL',
                    case_insensitive: true,
                  },
                },
              },
              {
                regexp: {
                  'address.keyword': {
                    value: `.*${filter}.*`,
                    flags: 'ALL',
                    case_insensitive: true,
                  },
                },
              },
            ],
          },
        },
        sort: [{ created_at: 'desc' }],
      },
    });
    return res.hits.hits;
  }

  async searchNFT(filter): Promise<any> {
    const res = await client.search({
      index: 'nft',
      body: {
        size: 10,
        _source: [
          'title',
          'nft_address',
          'image_url',
          'created_at',
          'collection_name',
        ],
        query: {
          bool: {
            should: [
              {
                regexp: {
                  'title.keyword': {
                    value: `.*${filter}.*`,
                    flags: 'ALL',
                    case_insensitive: true,
                  },
                },
              },
              {
                regexp: {
                  'nft_address.keyword': {
                    value: `.*${filter}.*`,
                    flags: 'ALL',
                    case_insensitive: true,
                  },
                },
              },
            ],
          },
        },
        sort: [{ created_at: 'desc' }],
      },
    });
    return res.hits.hits;
  }

  async search(filter): Promise<any> {
    const collectionSeach = await this.searchCollection(filter);
    const nftSeach = await this.searchNFT(filter);
    return {
      collectionSeach,
      nftSeach,
    };
  }
}
