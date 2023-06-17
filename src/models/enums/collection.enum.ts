export enum CollectionTypeEnum {
  ERC721 = 0,
  ERC1155 = 1,
}

export enum CollectionStatusEnum {
  NOT_AVAILABLE = -1,
  UNVERIFIED,
  VERIFIED,
}

export enum NFTOrderEnum {
  PRICE_HIGH_TO_LOW,
  PRICE_LOW_TO_HIGH,
  RARITY_HIGH_TO_LOW,
  RARITY_LOW_TO_HIGH,
  RECENTLY,
  NEWEST,
}

export enum DefaultCurSor {
  PRICE_HIGH_TO_LOW = '',
  PRICE_LOW_TO_HIGH = '',
  RARITY_HIGH_TO_LOW = '',
  RARITY_LOW_TO_HIGH = '',
}

export enum NFTStatusEnum {
  BUY_NOW,
  LIVE_AUCTION,
  NOT_FOR_SALE,
}

export enum CollectionActivityTypeEnum {
  LISTING,
  CANCEL,
  UPDATE,
  OFFER,
  CANCEL_OFFER,
  ACCEPT_OFFER,
  COMPLETE,
  TRANSFER,
  MINT,
  COLLECTION_OFFER,
  ACCEPT_COLLECTION_OFFER,
  CANCEL_COLLECTION_OFFER,
}

export enum CollectionActivitySearchTypeEnum {
  COLLECTION,
  NFT,
  USER,
}

export enum ChainUrlStatusEnum {
  GOOD,
  BAD,
}
