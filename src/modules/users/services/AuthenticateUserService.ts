import crypto from 'crypto';

import refreshTokenConfig from '@config/refreshToken';
import AppError from '@shared/errors/AppError';

import { IEncrypter } from '@shared/container/encrypterProvider/protocols/IEncrypt';
import IUsersRepository from '../repositories/IUsersRepository';
import IRefreshTokensRepository from '../repositories/IRefreshTokensRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { IUserModel } from '../models/IUserModel';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: IUserModel;
  accessToken: string;
  refreshToken: string;
}

class AuthenticateUserService {
  constructor(
    private usersRepository: IUsersRepository,
    private hashProvider: IHashProvider,
    private refreshTokensRepository: IRefreshTokensRepository,
    private encrypter: IEncrypter,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Combinação de email/senha incorreta.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Combinação de email/senha incorreta.', 401);
    }

    await this.encrypter.encrypt(user.id);

    const { refresh_token } = await this.refreshTokensRepository.create({
      access_token: 'token',
      expires_in: refreshTokenConfig.refreshToken.expiresIn,
      is_active: true,
      refresh_token: crypto.randomBytes(32).toString('hex'),
      user_id: user.id,
    });

    return {
      user,
      accessToken: 'token',
      refreshToken: refresh_token,
    };
  }
}

export default AuthenticateUserService;
