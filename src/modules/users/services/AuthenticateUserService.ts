import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import crypto from 'crypto';

import authConfig from '@config/auth';
import refreshTokenConfig from '@config/refreshToken';
import AppError from '@shared/errors/AppError';

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

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('RefreshTokensRepository')
    private refreshTokensRepository: IRefreshTokensRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Combinação de email/senha incorreta!', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Combinação de email/senha incorreta!', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    const { refresh_token } = await this.refreshTokensRepository.create({
      access_token: token,
      expires_in: refreshTokenConfig.refreshToken.expiresIn,
      is_active: true,
      refresh_token: crypto.randomBytes(32).toString('hex'),
      user_id: user.id,
    });

    return {
      user,
      accessToken: token,
      refreshToken: refresh_token,
    };
  }
}

export default AuthenticateUserService;
