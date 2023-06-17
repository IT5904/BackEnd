import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { config } from '@config/app';
import base58 from 'bs58';
import nacl from 'tweetnacl';
import {
  fromB64,
  fromSerializedSignature,
  IntentScope,
  messageWithIntent,
} from '@mysten/sui.js';
import { blake2b } from '@noble/hashes/blake2b';

export class VerifyUtils {
  public static createToken(payload, options: SignOptions) {
    const signOptions = Object.assign(
      {
        algorithm: 'HS256',
        expiresIn: '7d',
      },
      options,
    );
    return new Promise((resolve, reject) => {
      jwt.sign(payload, config.jwt_secret, signOptions, (err, encoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(encoded);
        }
      });
    });
  }

  public static verifyToken(token: string, ignoreExpiration?: boolean) {
    return new Promise((resolve, reject) => {
      if (ignoreExpiration) {
        jwt.verify(
          token,
          config.jwt_secret,
          {
            ignoreExpiration: ignoreExpiration,
          },
          (err: any, decoded: unknown) => {
            if (err) {
              reject(err);
            } else {
              resolve(decoded);
            }
          },
        );
      } else {
        jwt.verify(token, config.jwt_secret, (err: any, decoded: unknown) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      }
    });
  }

  public static verifySignature(
    message: string,
    signature: string,
    public_key: string,
  ): boolean {
    return nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      base58.decode(signature),
      base58.decode(public_key),
    );
  }

  // public static checkAddressFormat(address: string): boolean {
  //   if (!address || !ObjectId(address)) return false;
  //   address = address.toString();
  //   return address.length === 42 && address.startsWith('0x');
  // }

  public static verifySignedMessage(signature: any, messageBytes: any) {
    const signatureData = fromSerializedSignature(signature);
    const message = messageWithIntent(
      IntentScope.PersonalMessage,
      fromB64(messageBytes),
    );
    return nacl.sign.detached.verify(
      blake2b(message, { dkLen: 32 }),
      signatureData.signature,
      signatureData.pubKey.toBytes(),
    );
  }
}
