import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import { addSeconds, isAfter } from 'date-fns';
import crypto from 'crypto';

import refreshTokenConfig from '@config/refreshToken';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IRefreshTokensRepository from '../repositories/IRefreshTokensRepository';
import { IUserModel } from '../models/IUserModel';

interface IResponse {
  user: IUserModel;
  accessToken: string;
  refreshToken: string;
}

@injectable()
class UpdateRefreshTokenService {
  constructor(
    @inject('RefreshTokensRepository')
    private refreshTokensRepository: IRefreshTokensRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(refreshToken: string): Promise<IResponse> {
    const checkRefreshTokenExists = await this.refreshTokensRepository.findByRefreshToken(
      refreshToken,
    );

    if (!checkRefreshTokenExists) {
      throw new AppError('Token Inválido', 401);
    }

    if (!checkRefreshTokenExists.is_active) {
      throw new AppError('Token Inválido', 401);
    }

    const { created_at, expires_in } = checkRefreshTokenExists;

    if (isAfter(new Date(Date.now()), addSeconds(created_at, expires_in))) {
      throw new AppError('Token Inválido', 401);
    }

    checkRefreshTokenExists.is_active = false;

    await this.refreshTokensRepository.save(checkRefreshTokenExists);

    const checkUserExists = await this.usersRepository.findById(
      checkRefreshTokenExists.user_id,
    );

    if (!checkUserExists) {
      throw new AppError('Usuário não encontrado no sistema!', 404);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: checkUserExists.id,
      expiresIn,
    });

    const newRefreshToken = await this.refreshTokensRepository.create({
      access_token: token,
      refresh_token: crypto.randomBytes(32).toString('hex'),
      expires_in: refreshTokenConfig.refreshToken.expiresIn,
      is_active: true,
      user_id: checkUserExists.id,
    });

    return {
      user: checkUserExists,
      accessToken: token,
      refreshToken: newRefreshToken.refresh_token,
    };
  }
}

export default UpdateRefreshTokenService;
