import IRefreshTokensRepository from '@modules/users/repositories/IRefreshTokensRepository';
import { IRefreshTokenModel } from '@modules/users/models/IRefreshTokenModel';

class FakeRefreshTokensRepository implements IRefreshTokensRepository {
  public async findByUserId(): Promise<IRefreshTokenModel | undefined> {
    return {
      id: 'any_id',
      accessToken: 'any_access_token',
      userId: 'any_user_id',
      refreshToken: 'any_refresh_token',
      expiresIn: 100,
      isActive: true,
      createdAt: new Date('2022-01-01T03:00:00'),
      updatedAt: new Date('2022-01-01T03:00:00'),
    };
  }

  public async findByRefreshToken(): Promise<IRefreshTokenModel | undefined> {
    return {
      id: 'any_id',
      accessToken: 'any_access_token',
      userId: 'any_user_id',
      refreshToken: 'any_refresh_token',
      expiresIn: 100,
      isActive: true,
      createdAt: new Date('2022-01-01T03:00:00'),
      updatedAt: new Date('2022-01-01T03:00:00'),
    };
  }

  public async findByAccessToken(): Promise<IRefreshTokenModel | undefined> {
    return {
      id: 'any_id',
      accessToken: 'any_access_token',
      userId: 'any_user_id',
      refreshToken: 'any_refresh_token',
      expiresIn: 100,
      isActive: true,
      createdAt: new Date('2022-01-01T03:00:00'),
      updatedAt: new Date('2022-01-01T03:00:00'),
    };
  }

  public async create(): Promise<IRefreshTokenModel> {
    return {
      id: 'any_id',
      accessToken: 'any_access_token',
      userId: 'any_user_id',
      refreshToken: 'any_refresh_token',
      expiresIn: 100,
      isActive: true,
      createdAt: new Date('2022-01-01T03:00:00'),
      updatedAt: new Date('2022-01-01T03:00:00'),
    };
  }

  public async save(): Promise<IRefreshTokenModel> {
    return {
      id: 'any_id',
      accessToken: 'any_access_token',
      userId: 'any_user_id',
      refreshToken: 'any_refresh_token',
      expiresIn: 100,
      isActive: true,
      createdAt: new Date('2022-01-01T03:00:00'),
      updatedAt: new Date('2022-01-01T03:00:00'),
    };
  }
}

export default FakeRefreshTokensRepository;
