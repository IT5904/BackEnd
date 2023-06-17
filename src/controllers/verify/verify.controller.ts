import { ResponseBuilder } from '@core/utils/response-builder';
import Router from '@koa/router';
import { AppState } from '@models/app.state';
import { APIEnum } from '@models/enums/api.category.enum';
import { ParameterizedContext } from 'koa';
import { Context } from 'vm';
import { UserRequired } from '@core/middleware/auth.middleware';
import { validateMiddleware } from '@core/middleware/validate.middleware';
import { VerifyReqModel } from '@models/verify/verify-req';
import { Ed25519Keypair, bcs } from '@mysten/sui.js';
import { BCS } from '@mysten/bcs';
import IP from 'ip';

import dotenv from 'dotenv';
// import { getRepository } from 'typeorm';
// import { UserInfoEntity } from '@entities/postgres-entities';
import { getConnection } from 'typeorm';
import AccountInoModel from '@entities/mongo-entities/ino/account-ino.entity';
dotenv.config();

const VerifyRoute = new Router({
  prefix: '/verify',
});

async function SignByPartner(account: string) {
  const DNFT: string =
    process.env.MNEMONIC ||
    'approve remain cube order spell meat act artwork spider rough solution today';
  const keypairDNFT = Ed25519Keypair.deriveKeypair(DNFT);

  const sale_plan =
    '0xad733d6d8b4f479ac137da8ba5f588c2bfa9a913c6617e368cb89dc972ddb02a';

  const plan = bcs.ser(BCS.ADDRESS, sale_plan.slice(2)).toBytes();
  const addr = bcs.ser(BCS.ADDRESS, account).toBytes();
  const index = bcs.ser(BCS.U64, 0n).toBytes();
  const msg = new Uint8Array([...plan, ...addr, ...index]);
  const sig = keypairDNFT.signData(msg);

  return [Object.values(sig), Object.values(msg)];
}

async function Sign(account: string, project: string) {
  const DNFT =
    process.env.MNEMONIC ||
    'amount foil produce world tuna spot pulse come couch inflict scatter live';
  // 'uLmMoTQgJOgq9UcTgVv0YkwhHDJAoxWC1vMBrZyfajY=';
  const keypairDNFT = Ed25519Keypair.deriveKeypair(DNFT);
  const resultData = account + '.' + project;
  const signData = new TextEncoder().encode(resultData);
  const _signature = await keypairDNFT.signData(signData);

  return [Object.values(_signature), Object.values(signData)];
}

async function SignWhitelist(account: string, project: string) {
  const DNFT =
    process.env.MNEMONIC ||
    'awake eye wear logic property vital pencil broom fiscal exercise viable apart';
  // 'uLmMoTQgJOgq9UcTgVv0YkwhHDJAoxWC1vMBrZyfajY=';
  const accountInfo = await AccountInoModel.findOne({
    address: account,
    [project]: { $exists: true },
  });

  if (
    !accountInfo ||
    !JSON.parse(JSON.stringify(accountInfo))[project]?.isWhitelist
  )
    return 'You are not in whitelist!!!';

  const keypairDNFT = Ed25519Keypair.deriveKeypair(DNFT);
  const resultData = account + '.' + project;
  const signData = new TextEncoder().encode(resultData);
  const _signature = await keypairDNFT.signData(signData);

  return [Object.values(_signature), Object.values(signData)];
}

async function SignPrivate(account: string, project: string) {
  const DNFT =
    process.env.MNEMONIC ||
    'else poet beef cannon material actual jeans range tissue capital cry material';
  const accountInfo = await AccountInoModel.findOne({
    address: account,
    [project]: { $exists: true },
  });

  if (
    !accountInfo ||
    !JSON.parse(JSON.stringify(accountInfo))[project]?.isPrivate
  )
    return 'You are not in privateList!!!';

  const keypairDNFT = Ed25519Keypair.deriveKeypair(DNFT);
  const resultData = account + '.' + project;
  const signData = new TextEncoder().encode(resultData);
  const _signature = await keypairDNFT.signData(signData);

  return [Object.values(_signature), Object.values(signData)];
}

VerifyRoute.post(
  APIEnum.SIGN,
  UserRequired,
  validateMiddleware({
    body: VerifyReqModel,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const ipAddress =
      ctx.request.headers['cf-connecting-ip'] ||
      ctx.request.headers['x-real-ip'] ||
      ctx.request.headers['x-forwarded-for'] ||
      IP.address();
    let sign: any = [];
    // if (ctx.request.body.code === 'abyssworld') {
    //   sign = await SignByPartner(ctx.state.user.walletAddress);
    // } else {
    //   if (ctx.request.body.type === 'whitelist') {
    //     sign = await SignWhitelist(
    //       ctx.state.user.walletAddress,
    //       ctx.request.body.code,
    //     );
    //   } else {
    //     sign = await Sign(ctx.state.user.walletAddress, ctx.request.body.code);
    //   }
    // }
    switch (ctx.request.body.type) {
      case 'abyssworld':
        sign = await SignByPartner(ctx.state.user.walletAddress);
        break;
      case 'whitelist':
        sign = await SignWhitelist(
          ctx.state.user.walletAddress,
          ctx.request.body.code,
        );
        break;
      case 'private':
        sign = await SignPrivate(
          ctx.state.user.walletAddress,
          ctx.request.body.code,
        );
        break;

      case 'public':
        sign = await Sign(ctx.state.user.walletAddress, ctx.request.body.code);
        break;
      default:
        break;
    }
    const data = {
      user: ctx.state.user,
      signature: sign,
    };

    const checkUserProfile = await getConnection().manager.query(
      `SELECT public.user_check_signature('${ctx.state.user.walletAddress}', '${ipAddress}', '${ctx.request.body.code}')`,
    );
    console.log(checkUserProfile[0].user_check_signatures);

    if (checkUserProfile[0]?.user_check_signature > 0) {
      ctx.body = new ResponseBuilder(data).build();
    } else {
      await sleepRandom(3500, 6500);
      ctx.body = new ResponseBuilder(data).build();
    }
  },
);

// function sleep(ms: number) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

function sleepRandom(startMs: number, endMs: number) {
  const result: number =
    Math.floor(Math.random() * (endMs - startMs + 1)) + startMs;
  return new Promise((resolve) => {
    setTimeout(resolve, result);
  });
}

export { VerifyRoute };
