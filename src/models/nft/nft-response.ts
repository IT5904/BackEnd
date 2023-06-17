import { Expose, Type } from 'class-transformer';

export class NftResponse {
  @Expose()
  id: number;

  @Expose({
    name: 'collection_address',
  })
  collectionAddress: string;

  @Expose()
  title: string;

  @Expose()
  price: string;

  @Expose()
  description: string;

  @Expose({ name: 'nft_address' })
  nftId: string;

  @Expose({ name: 'collection_id' })
  collectionId: number;

  @Expose({ name: 'image_url' })
  imageUrl: string;

  @Expose({ name: 'is_listing' })
  isListing: boolean;

  @Expose({ name: 'creator_address' })
  creatorAddress: string;

  @Expose({ name: 'external_link' })
  externalLink: string;

  @Expose()
  properties: string;

  @Expose({ name: 'start_price' })
  startPrice: string;

  @Expose({ name: 'end_price' })
  endPrice: string;

  @Expose()
  quantity: number;

  @Expose({ name: 'sale_type' })
  saleType: number;

  @Expose({ name: 'nft_status' })
  nftStatus: number;

  @Expose({ name: 'reserve_buyer_id' })
  reserveBuyerId: number;

  @Expose({ name: 'start_time' })
  startTime: number;

  @Expose({ name: 'block_timestamp' })
  blockTimestamp: number;

  @Expose({ name: 'owner_address' })
  ownerAddress: string;

  @Expose({ name: 'market_price' })
  marketPrice: string;

  @Expose({ name: 'listing_price' })
  listingPrice: string;

  @Expose({ name: 'offer_price' })
  offerPrice: string;

  @Expose({ name: 'is_like' })
  isLike: boolean;

  @Expose({ name: 'number_like' })
  numberLike: number;

  @Expose({ name: 'owner_image' })
  ownerImage: string;

  @Expose({ name: 'collection_name' })
  collectionName: string;

  @Expose({ name: 'collection_image' })
  collectionImage: string;

  @Expose({ name: 'collection_banner' })
  collectionBanner: string;

  @Expose({ name: 'floor_price_listing' })
  floorPriceListing: number;

  @Expose({ name: 'royalty_fee' })
  royaltyFee: number;

  @Expose()
  verify: number;

  @Expose()
  version: number;

  @Expose()
  ranking: number;

  @Expose({ name: 'rarity_type' })
  rarityType: string;

  @Expose({ name: 'time_listing' })
  timeListing: Date;
}

export class NftDetailResponse {
  @Expose()
  id: number;

  @Expose({
    name: 'collection_address',
  })
  collectionAddress: string;

  @Expose()
  title: string;

  @Expose()
  price: string;

  @Expose({ name: 'max_quantity' })
  maxQuantity: number;

  @Expose()
  description: string;

  @Expose({ name: 'nft_address' })
  nftId: string;

  @Expose({ name: 'owner_address' })
  ownerAddress: string;

  @Expose({ name: 'owner_image' })
  ownerImage: string;

  @Expose({ name: 'creator_address' })
  creator_Address: string;

  @Expose({ name: 'collection_id' })
  collectionId: number;

  @Expose({ name: 'image_url' })
  imageUrl: string;

  @Expose({ name: 'is_listing' })
  isListing: boolean;

  @Expose({ name: 'external_link' })
  externalLink: string;

  @Expose()
  properties: any[];

  @Expose({ name: 'start_price' })
  startPrice: string;

  @Expose({ name: 'end_price' })
  endPrice: string;

  @Expose()
  quantity: number;

  @Expose({ name: 'sale_type' })
  saleType: number;

  @Expose({ name: 'nft_status' })
  nftStatus: number;

  @Expose({ name: 'reserve_buyer_id' })
  reserveBuyerId: number;

  @Expose({ name: 'start_time' })
  startTime: number;

  @Expose({ name: 'block_timestamp' })
  blockTimestamp: number;

  @Expose({ name: 'market_price' })
  marketPrice: string;

  @Expose({ name: 'listing_price' })
  listingPrice: string;

  @Expose({ name: 'offer_price' })
  offerPrice: string;

  @Expose({ name: 'collection_name' })
  collectionName: string;

  @Expose({ name: 'collection_image' })
  collectionImage: string;

  @Expose({ name: 'collection_banner' })
  collectionBanner: string;

  @Expose({ name: 'is_like' })
  isLike: boolean;

  @Expose({ name: 'number_like' })
  numberLike: number;

  @Expose({ name: 'floor_price_listing' })
  floorPriceListing: number;

  @Expose({ name: 'royalty_fee' })
  royaltyFee: number;

  @Expose()
  verify: number;

  @Expose()
  version: number;

  @Expose()
  ranking: number;

  @Expose({ name: 'rarity_type' })
  rarityType: string;

  @Expose({ name: 'time_listing' })
  timeListing: Date;

  @Expose({ name: 'total_items' })
  totalItems: number;
}

export class NftOfferResponse {
  @Expose({ name: 'user_address' })
  userAddress: string;

  @Expose({ name: 'owner_image' })
  ownerImage: string;

  @Expose({ name: 'price' })
  price: string;

  @Expose({ name: 'status' })
  status: number;

  @Expose({ name: 'expire_time' })
  expireTime: number;

  @Expose({ name: 'start_time' })
  startTime: number;

  @Expose({ name: 'block_timestamp' })
  blockTimestamp: number;

  @Expose({ name: 'title' })
  nftTitle: string;

  @Expose({ name: 'nft_address' })
  nftAddress: string;

  @Expose({ name: 'image_url' })
  nftImageUrl: string;
}

export class NftCollectionOfferResponse {
  @Expose({ name: 'user_address' })
  userAddress: string;

  @Expose({ name: 'collection_address' })
  collectionAddress: string;

  @Expose({ name: 'price' })
  price: string;

  @Expose({ name: 'status' })
  status: number;

  @Expose({ name: 'quantity' })
  quantity: number;

  @Expose({ name: 'expire_time' })
  expireTime: number;

  @Expose({ name: 'block_timestamp' })
  blockTimestamp: number;

  @Expose({ name: 'name' })
  collectionName: string;

  @Expose({ name: 'logo' })
  collectionLogo: string;

  @Expose({ name: 'onchain_type' })
  onchainType: string;
}

export class NftOfferReceivedResponse {
  @Expose({ name: 'title' })
  nftTitle: string;

  @Expose({ name: 'nft_address' })
  nftAddress: string;

  @Expose({ name: 'image_url' })
  nftImageUrl: string;

  @Expose({ name: 'listing_price' })
  listingPrice: string;

  @Expose({ name: 'offer_price' })
  offerPrice: string;

  @Expose({ name: 'market_price' })
  marketPrice: string;

  @Expose({ name: 'offer_list' })
  @Type(() => OfferList)
  offerList: OfferList[];
}

export class OfferList {
  @Expose({ name: 'user_address' })
  userAddress: string;

  @Expose({ name: 'owner_image' })
  ownerImage: string;

  @Expose({ name: 'price' })
  price: string;

  @Expose({ name: 'status' })
  status: number;

  @Expose({ name: 'expire_time' })
  expireTime: number;

  @Expose({ name: 'start_time' })
  startTime: number;

  @Expose({ name: 'block_timestamp' })
  blockTimestamp: number;
}

export class NftCartResponse {
  @Expose({ name: 'price' })
  price: string;

  @Expose({ name: 'status' })
  status: number;

  @Expose({ name: 'expire_time' })
  expireTime: number;

  @Expose({ name: 'start_time' })
  startTime: number;

  @Expose({ name: 'block_timestamp' })
  blockTimestamp: number;

  @Expose({ name: 'title' })
  nftTitle: string;

  @Expose({ name: 'nft_address' })
  nftAddress: string;

  @Expose({ name: 'image_url' })
  nftImageUrl: string;

  @Expose({ name: 'collection_name' })
  collectionName: string;

  @Expose({ name: 'collection_logo' })
  collectionLogo: string;

  @Expose({ name: 'collection_banner' })
  collectionBanner: string;

  @Expose({ name: 'collection_address' })
  collectionAddress: string;

  @Expose({ name: 'owner_address' })
  ownerAddress: string;

  @Expose({ name: 'market_price' })
  marketPrice: string;

  @Expose({ name: 'listing_price' })
  listingPrice: string;

  @Expose({ name: 'offer_price' })
  offerPrice: string;

  @Expose()
  verify: number;

  @Expose()
  version: number;
}
