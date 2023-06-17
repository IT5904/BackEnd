import { logger } from '@core/logger';

export enum ResponseCodeEnum {
  /**
   * Internal server error
   */
  CM0000 = 'CM0000',

  /**
   * Resource not found
   */
  CM0001 = 'CM0001',

  /**
   * Forbidden
   */
  CM0002 = 'CM0002',

  /**
   * Unauthorized
   */
  CM0004 = 'CM0004',

  /**
   * Request parameters error
   */
  CM0005 = 'CM0005',

  /**
   * User already exists
   */
  CM0006 = 'CM0006',

  /**
   * Try add normal user into waiting list
   */
  CM0007 = 'CM0007',

  /**
   * No user found
   */
  CM0008 = 'CM0008',

  /**
   * Wrong signature
   */
  CM0009 = 'CM0009',

  /**
   * Can't edit
   */
  CM0010 = 'CM0010',

  /**
   * You are not the owner
   */
  CM0011 = 'CM0011',

  /**
   * Invalid Address
   */
  CM0012 = 'CM0012',

  /**
   * PoolINO not found
   */
  CM0013 = 'CM0013',

  /**
   * Cacl Whitelist Fail
   */
  CM0014 = 'CM0014',

  /**
   * Social invalid
   */
  CM0015 = 'CM0015',

  /**
   * Wallet address used
   */
  CM0016 = 'CM0016',

  /**
   * Something went wrong
   */
  CM0017 = 'CM0017',
}

const RESPONSE_CODE_MESSAGE_MAP: { [key in ResponseCodeEnum]: string } = {
  [ResponseCodeEnum.CM0000]: 'Internal server error',
  [ResponseCodeEnum.CM0001]: 'Resource not found',
  [ResponseCodeEnum.CM0002]: 'Forbidden',
  [ResponseCodeEnum.CM0004]: 'Unauthorized',
  [ResponseCodeEnum.CM0005]: 'Request parameters error',
  [ResponseCodeEnum.CM0006]: 'User already exists',
  [ResponseCodeEnum.CM0007]: 'Try add normal user into waiting list',
  [ResponseCodeEnum.CM0008]: 'No user found',
  [ResponseCodeEnum.CM0009]: 'Wrong signature',
  [ResponseCodeEnum.CM0010]: `Can't edit`,
  [ResponseCodeEnum.CM0011]: `You are not the owner`,
  [ResponseCodeEnum.CM0012]: `Invalid address`,
  [ResponseCodeEnum.CM0013]: `PoolINO not found`,
  [ResponseCodeEnum.CM0014]: `Cacl Whitelist Fail`,
  [ResponseCodeEnum.CM0015]: `Your social account has been used or is not valid`,
  [ResponseCodeEnum.CM0016]: `Your wallet address has been used`,
  [ResponseCodeEnum.CM0017]: `Something went wrong`,
};

export const getMessage = (responseCode: ResponseCodeEnum): string => {
  if (RESPONSE_CODE_MESSAGE_MAP[responseCode]) {
    return RESPONSE_CODE_MESSAGE_MAP[responseCode];
  } else {
    logger.error('Response code not found in dictionary', responseCode);
    return null;
  }
};
