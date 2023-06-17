export enum NoticeSubTypeEnum {
  LISTING,
  CANCEL,
  UPDATE,
  OFFER,
  CANCEL_OFFER,
  ACCEPT_OFFER,
  COMPLETE,
  TRANSFER,
  MINT,
}

export enum NoticeTypeEnum {
  USER_ACTION,
}

export enum NoticeContentEnum {
  LISTING = 'Listing',
  CANCEL = 'Default',
  UPDATE = 'Update Listing',
  OFFER = 'Offer',
  CANCEL_OFFER = 'Cancel Offer',
  ACCEPT_OFFER = 'Accept Offer',
  COMPLETE = 'Buy Success',
  TRANSFER = 'Transfer',
  MINT = 'Mint',
}
