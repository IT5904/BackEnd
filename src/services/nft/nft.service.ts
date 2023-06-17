import 'reflect-metadata';
import { NftRepository } from '@repositories/nft/nft.respository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  NftExploreModel,
  NftGetUserNFTModel,
  NftSearchModel,
  NftFavoriteSearchModel,
} from '@models/nft/nft-search';
import {
  NftResponse,
  NftDetailResponse,
  NftOfferResponse,
  NftCartResponse,
  NftOfferReceivedResponse,
  NftCollectionOfferResponse,
} from '@models/nft/nft-response';
import { NftDataModel } from '@models/nft/nft-data';
import { UserInfo } from '@models/authorzization/user.info';
import { NftEntity } from '@entities/postgres-entities';
// import { OwnerNftRepository } from '@repositories/owner-nft/owner-nft.repository';
import { plainToClass } from 'class-transformer';

@Service()
export class NftService {
  constructor(
    @InjectRepository()
    private readonly nftRepository: NftRepository, // @InjectRepository() // private readonly onwerNftRepository: OwnerNftRepository,
  ) {}

  /**
   * Get list nft
   */
  async getListNft(
    dataQuery: NftSearchModel,
    user: UserInfo,
  ): Promise<{ rows: NftResponse[]; nextPage: boolean }> {
    return await this.nftRepository.getListNft(dataQuery, user);
  }

  /**
   * Get list favorite nft
   */
  async getListFavoriteNft(
    dataQuery: NftFavoriteSearchModel,
    user: UserInfo,
  ): Promise<{ rows: NftResponse[]; nextPage: boolean }> {
    return await this.nftRepository.getFavoriteNfts(dataQuery, user);
  }

  /**
   * Get explore nft
   */
  async getNftExplore(
    dataQuery: NftExploreModel,
    user: UserInfo,
  ): Promise<{ rows: NftResponse[]; nextPage: boolean }> {
    return await this.nftRepository.getNftExplore(dataQuery, user);
  }

  /**
   * Get user nft
   */
  async getUserNft(
    dataQuery: NftGetUserNFTModel,
    user: UserInfo,
    address: string,
  ): Promise<{ rows: NftResponse[]; nextPage: boolean }> {
    return await this.nftRepository.getUserNft(dataQuery, user, address);
  }

  /**
   * Get more nft
   */
  async getMoreNft(
    dataQuery,
    user: UserInfo,
  ): Promise<{ rows: NftResponse[]; nextPage: boolean }> {
    return await this.nftRepository.getMoreNft(dataQuery, user);
  }

  /**
   * Get offers nft
   */
  async getOfferNft(
    dataQuery,
  ): Promise<{ rows: NftOfferResponse[]; nextPage: boolean }> {
    return await this.nftRepository.getOfferNft(dataQuery);
  }

  /**
   * Get collection offers nft
   */
  async getCollectionOfferNft(
    dataQuery,
  ): Promise<{ rows: NftCollectionOfferResponse[]; nextPage: boolean }> {
    return await this.nftRepository.getCollectionOfferNft(dataQuery);
  }

  /**
   * Get user offers nft
   */
  async getUserOfferNft(
    dataQuery,
    userAddress,
  ): Promise<{ rows: NftOfferResponse[]; nextPage: boolean }> {
    return await this.nftRepository.getUserOfferNft(dataQuery, userAddress);
  }

  /**
   * Get user collection offers nft
   */
  async getUserCollectionOfferNft(
    dataQuery,
    userAddress,
  ): Promise<{ rows: NftCollectionOfferResponse[]; nextPage: boolean }> {
    return await this.nftRepository.getUserCollectionOfferNft(
      dataQuery,
      userAddress,
    );
  }

  /**
   * Get user offers received nft
   */
  async getUserOfferReceivedNft(
    dataQuery,
    userAddress,
  ): Promise<{ rows: NftOfferReceivedResponse[]; nextPage: boolean }> {
    return await this.nftRepository.getUserOfferReceivedNft(
      dataQuery,
      userAddress,
    );
  }

  /**
   * Get cart nft
   */
  async getCartNft(
    dataQuery,
  ): Promise<{ rows: NftCartResponse[]; total: number }> {
    return await this.nftRepository.getCartNft(dataQuery);
  }

  /**
   * Get detail nft
   */
  async getNftDetail(
    address: string,
    user: UserInfo,
  ): Promise<NftDetailResponse> {
    const nft = await this.nftRepository.getNFTDetail(address, user);
    return plainToClass(NftDetailResponse, nft);
  }

  /**
   * Refresh nft
   */
  async refreshOwnerNFT(address: string): Promise<NftDetailResponse> {
    const nft = await this.nftRepository.refreshOwnerNFT(address);
    return plainToClass(NftDetailResponse, nft);
  }

  async createNft(data: NftDataModel, user: UserInfo): Promise<NftEntity> {
    return await this.nftRepository.createNft(data, user);
  }

  async likeNft(data, user: UserInfo): Promise<boolean> {
    return await this.nftRepository.likeNft(data, user);
  }

  async getPortfolioNFT(user: UserInfo): Promise<any> {
    return await this.nftRepository.getPortfolioNFT(user);
  }
}
