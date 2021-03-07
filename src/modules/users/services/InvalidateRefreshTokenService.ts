import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IRefreshTokensRepository from '../repositories/IRefreshTokensRepository';

interface IRequest {
  userId: string;
  accessToken: string;
}

@injectable()
class InvalidateRefreshTokenService {
  constructor(
    @inject('RefreshTokensRepository')
    private refreshTokensRepository: IRefreshTokensRepository,
  ) {}

  public async execute({ userId, accessToken }: IRequest): Promise<void> {
    const [, token] = accessToken.split(' ');

    const checkRefreshTokenExists = await this.refreshTokensRepository.findByAccessToken(
      token,
    );

    if (checkRefreshTokenExists?.user_id !== userId) {
      throw new AppError(
        'Usuário não tem permissão para invalidar refresh token',
        403,
      );
    }

    checkRefreshTokenExists.is_active = false;

    await this.refreshTokensRepository.save(checkRefreshTokenExists);
  }
}

export default InvalidateRefreshTokenService;
