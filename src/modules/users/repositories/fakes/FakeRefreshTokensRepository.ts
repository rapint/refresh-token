import { v4 } from 'uuid';

import IRefreshTokensRepository from '@modules/users/repositories/IRefreshTokensRepository';
import ICreateRefreshTokenDTO from '@modules/users/dtos/ICreateRefreshTokenDTO';

import RefreshToken from '../../infra/typeorm/entities/RefreshToken';

class FakeRefreshTokensRepository implements IRefreshTokensRepository {
  private refreshToken: RefreshToken[] = [];

  public async findByUserId(id: string): Promise<RefreshToken | undefined> {
    const refeshToken = this.refreshToken.find(
      findRefreshToken => findRefreshToken.user_id === id,
    );

    return refeshToken;
  }

  public async findByRefreshToken(
    token: string,
  ): Promise<RefreshToken | undefined> {
    const refreshToken = this.refreshToken.find(
      findRefreshToken => findRefreshToken.refresh_token === token,
    );

    return refreshToken;
  }

  public async findByAccessToken(
    token: string,
  ): Promise<RefreshToken | undefined> {
    const refreshToken = this.refreshToken.find(
      findRefreshToken => findRefreshToken.access_token === token,
    );

    return refreshToken;
  }

  public async create({
    access_token,
    expires_in,
    is_active,
    refresh_token,
    user_id,
  }: ICreateRefreshTokenDTO): Promise<RefreshToken> {
    const user = new RefreshToken();

    Object.assign(user, {
      id: v4(),
      access_token,
      expires_in,
      is_active,
      refresh_token,
      user_id,
      created_at: Date.now(),
    });

    this.refreshToken.push(user);

    return user;
  }

  public async save(data: RefreshToken): Promise<RefreshToken> {
    this.refreshToken.push(data);

    return data;
  }
}

export default FakeRefreshTokensRepository;
