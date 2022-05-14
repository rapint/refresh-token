import refreshTokenConfig from '@config/refreshToken';
import AppError from '@shared/errors/AppError';

import { IEncrypter } from '@shared/container/encrypterProvider/protocols/IEncrypt';
import { IGenerateHashProvider } from '@shared/container/generateHashProvider/protocols/IGenerateHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { IUserModel } from '../models/IUserModel';
import IRefreshTokensRepository from '../repositories/IRefreshTokensRepository';

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
    private encrypter: IEncrypter,
    private generateHashProvider: IGenerateHashProvider,
    private refreshTokensRepository: IRefreshTokensRepository,
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

    const accessToken = await this.encrypter.encrypt(user.id);

    const refreshToken = this.generateHashProvider.generate(12);

    await this.refreshTokensRepository.create({
      accessToken,
      expiresIn: refreshTokenConfig.refreshToken.expiresIn,
      isActive: true,
      refreshToken,
      userId: user.id,
    });

    return {
      user,
      accessToken: '',
      refreshToken: '',
    };
  }
}

export default AuthenticateUserService;
