import { Service } from 'typedi';
import { LoginRequest } from '@models/auth/login.request';
import { Container } from 'typedi';
import { UserService } from '@services/user/user.service';
import { ApiError } from '@models/api-error';
import { ResponseCodeEnum } from '@models/enums/response-code.enum';
import { VerifyUtils } from '@core/utils/verify';
import { config } from '@config/app';
import { UserInfo } from '@models/authorzization/user.info';
import { StatusCodes } from 'http-status-codes';
import { RefeshTokenRepository } from '@repositories/refesh-token/refesh-token.repository';
// import { UserTypeEnum } from '@models/enums/user.status';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserWalletRepository } from '@repositories/user/user-wallet.repository';
import { UserPostgresCreateRequest } from '@models/user/user-postgres-create.request';
import { OperationTypeEnum } from '@models/enums/operation-type.enum';
import { getRepository } from 'typeorm';
import { UserInfoEntity, UserWalletEntity } from '@entities/postgres-entities';

@Service()
export class AuthenticationService {
  private readonly refreshTokenRepository: RefeshTokenRepository;

  constructor(
    @InjectRepository()
    private readonly userWalletRepository: UserWalletRepository,
  ) {
    this.refreshTokenRepository = new RefeshTokenRepository();
  }

  async registOrEdit(
    model: UserPostgresCreateRequest,
  ): Promise<
    { user: UserInfo; token: unknown; refreshToken: string } | boolean
  > {
    const user = await this.userWalletRepository.getUserInfo(
      model.address,
      model.networkType,
    );
    const userInfoService = Container.get<UserService>(UserService);

    if (model.operationTypeEnum === OperationTypeEnum.REGISTER && user)
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0006);

    // TODO: when wallet release
    //const verify = VerifyUtils.verifySignature(config.login_message, model.signature, model.address);

    // if(!verify) throw new ApiError(ResponseCodeEnum.CM0009);

    await userInfoService.createUser(model, model.operationTypeEnum);
    if (model.operationTypeEnum !== OperationTypeEnum.REGISTER) return true;

    const userInfo = await this.userWalletRepository.getUserInfo(
      model.address,
      model.networkType,
    );

    const payloads: UserInfo = {
      id: userInfo.userId,
      name: userInfo.userName,
      email: userInfo.email,
      network: model.networkType,
      walletAddress: userInfo.address,
      // userType: UserTypeEnum.NORMAL,
    };

    const refreshToken = await this.createRefreshToken(payloads);

    const token = await VerifyUtils.createToken(
      {
        payloads,
      },
      {
        expiresIn: Number(config.jwt_expires_in),
      },
    );

    return {
      user: payloads,
      token,
      refreshToken,
    };
  }

  /**
   * Login
   */
  async login(
    model: LoginRequest,
    ipAddress: string,
    user: UserInfo,
  ): Promise<{ user: UserInfo; token: unknown; refreshToken: string }> {
    try {
      let userData = null;

      if (!user) {
        userData = await this.userWalletRepository.getUserInfo(
          model.address,
          model.network,
        );
      } else {
        userData = user;
      }

      if (!userData) {
        const checkAddress = await getRepository(UserWalletEntity)
          .createQueryBuilder()
          .select('*')
          .where('address = :address', { address: model.address })
          .getRawOne();
        if (checkAddress) {
          throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0016);
        }

        const verifySign = await VerifyUtils.verifySignedMessage(
          model.signature,
          model.messageBytes,
        );

        if (!verifySign) {
          throw new ApiError(StatusCodes.UNAUTHORIZED, ResponseCodeEnum.CM0009);
        }

        const newUser = await getRepository(UserInfoEntity).save({
          name: 'Unknown',
          avatarUrl: `https://source.boringavatars.com/pixel/120/${model.address}`,
          ipAddress: ipAddress,
          updateTimestamp: Date.now(),
        });

        const userWallet = await getRepository(UserWalletEntity).save({
          userInfoId: newUser.id,
          address: model.address,
          networkType: model.network,
          ipAddress: ipAddress,
          // signature: model.signature,
        });

        const payloads = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email || null,
          walletAddress: userWallet.address,
          network: userWallet.networkType,
          // userType: UserTypeEnum.NORMAL,
        };

        const refreshToken = await this.createRefreshToken(payloads);

        const token = await VerifyUtils.createToken(
          {
            payloads,
          },
          {
            expiresIn: Number(config.jwt_expires_in),
          },
        );

        return {
          user: payloads,
          token,
          refreshToken,
        };
      }

      const checkSign = await getRepository(UserWalletEntity)
        .createQueryBuilder('uw')
        .select(
          `
        uw.signature,
        uw.address
      `,
        )
        .where('uw.address = :walletAddress', {
          walletAddress: model.address,
        })
        .getRawOne();

      if (checkSign) {
        if (!checkSign.signature) {
          const verifySign = await VerifyUtils.verifySignedMessage(
            model.signature,
            model.messageBytes,
          );

          if (!verifySign) {
            throw new ApiError(
              StatusCodes.UNAUTHORIZED,
              ResponseCodeEnum.CM0009,
            );
          }

          await getRepository(UserWalletEntity)
            .createQueryBuilder()
            .update()
            .set({
              signature: model.signature,
            })
            .where('address = :walletAddress', {
              walletAddress: model.address,
            })
            .execute();
        } else {
          if (
            checkSign.signature.slice(checkSign.signature.length - 45) !==
            model.signature.slice(model.signature.length - 45)
          ) {
            throw new ApiError(
              StatusCodes.UNAUTHORIZED,
              ResponseCodeEnum.CM0009,
            );
          }
        }
      }

      const verifySign = await VerifyUtils.verifySignedMessage(
        model.signature,
        model.messageBytes,
      );

      if (!verifySign) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, ResponseCodeEnum.CM0009);
      }

      const payloads: UserInfo = {
        id: userData.id,
        name: userData.name ? userData.name : userData.userName,
        email: userData.email,
        walletAddress: model.address,
        network: model.network,
        // userType: UserTypeEnum.NORMAL,
      };

      const refreshToken = await this.createRefreshToken(payloads);

      const token = await VerifyUtils.createToken(
        {
          payloads,
        },
        {
          expiresIn: Number(config.jwt_expires_in),
        },
      );

      return {
        user: payloads,
        token,
        refreshToken,
      };
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0017);
    }
  }

  /**
   * Login by discord
   */
  async loginByDiscord(
    model: LoginRequest,
    ipAddress: string,
    user: UserInfo,
  ): Promise<{ user: UserInfo; token: unknown; refreshToken: string }> {
    // if (!VerifyUtils.checkAddressFormat(model.address)) {
    //   throw new ApiError(StatusCodes.NOT_FOUND, ResponseCodeEnum.CM0012);
    // }
    let userData = null;

    if (!user) {
      userData = await this.userWalletRepository.getUserInfo(
        model.address,
        model.network,
      );
    } else {
      userData = user;
    }
    if (!userData) {
      const checkAddress = await getRepository(UserWalletEntity)
        .createQueryBuilder()
        .select('*')
        .where('address = :address', { address: model.address })
        .getRawOne();
      if (checkAddress) {
        throw new ApiError(StatusCodes.NOT_FOUND, ResponseCodeEnum.CM0016);
      }
      const newUser = await getRepository(UserInfoEntity).save({
        name: 'Unknown',
        avatarUrl: `https://source.boringavatars.com/pixel/120/${model.address}`,
        ipAddress: ipAddress,
        updateTimestamp: Date.now(),
      });

      const userWallet = await getRepository(UserWalletEntity).save({
        userInfoId: newUser.id,
        address: model.address,
        networkType: model.network,
        ipAddress: ipAddress,
      });

      const payloads = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email || null,
        walletAddress: userWallet.address,
        network: userWallet.networkType,
        // userType: UserTypeEnum.NORMAL,
      };

      const refreshToken = await this.createRefreshToken(payloads);

      const token = await VerifyUtils.createToken(
        {
          payloads,
        },
        {
          expiresIn: Number(config.jwt_expires_in),
        },
      );

      return {
        user: payloads,
        token,
        refreshToken,
      };
    }

    // TODO: when wallet release
    //const verify = VerifyUtils.verifySignature(config.login_message, model.signature, model.address);

    // if(!verify) throw new ApiError(ResponseCodeEnum.CM0009);

    const payloads: UserInfo = {
      id: userData.id,
      name: userData.name ? userData.name : userData.userName,
      email: userData.email,
      walletAddress: model.address,
      network: model.network,
      // userType: UserTypeEnum.NORMAL,
    };

    const refreshToken = await this.createRefreshToken(payloads);

    const token = await VerifyUtils.createToken(
      {
        payloads,
      },
      {
        expiresIn: Number(config.jwt_expires_in),
      },
    );

    return {
      user: payloads,
      token,
      refreshToken,
    };
  }

  async createRefreshToken(payloads: UserInfo): Promise<string> {
    return await this.refreshTokenRepository.createRefreshToken(payloads);
  }

  async reFreshToken(
    refreshToken: string,
    payloads: UserInfo,
  ): Promise<{ refreshToken: string; token: unknown }> {
    const existsToken = await this.refreshTokenRepository.getRefeshToken(
      refreshToken,
    );

    if (existsToken) {
      if (
        existsToken.authenticationId !=
        this.refreshTokenRepository.generateAuthenticationId(payloads)
      ) {
        // user id:type does not match with db
        throw new ApiError(StatusCodes.FORBIDDEN, ResponseCodeEnum.CM0002);
      }

      await this.refreshTokenRepository.updateRefreshToken(refreshToken);

      const token = await VerifyUtils.createToken(
        { payloads },
        {
          expiresIn: Number(config.jwt_expires_in || 3600),
        },
      );

      return {
        refreshToken,
        token,
      };
    } else {
      throw new ApiError(StatusCodes.FORBIDDEN, ResponseCodeEnum.CM0004);
    }
  }

  async logout(refreshToken: string) {
    const existsToken = await this.refreshTokenRepository.getRefeshToken(
      refreshToken,
    );

    if (!existsToken) return;

    await this.refreshTokenRepository.deleteRefreshToken(refreshToken);
  }
}
