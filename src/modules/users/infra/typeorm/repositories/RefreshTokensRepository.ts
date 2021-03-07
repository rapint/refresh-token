import { getRepository, Repository } from 'typeorm';

import IRefreshTokensRepository from '@modules/users/repositories/IRefreshTokensRepository';

import ICreateRefreshTokenDTO from '@modules/users/dtos/ICreateRefreshTokenDTO';
import AuthenticationToken from '../entities/RefreshToken';

class RefreshTokensRepository implements IRefreshTokensRepository {
  private ormRepository: Repository<AuthenticationToken>;

  constructor() {
    this.ormRepository = getRepository(AuthenticationToken);
  }

  public async findByUserId(
    id: string,
  ): Promise<AuthenticationToken | undefined> {
    const token = await this.ormRepository.findOne({
      where: { user_id: id },
    });

    return token;
  }

  public async findByRefreshToken(
    token: string,
  ): Promise<AuthenticationToken | undefined> {
    const foundToken = await this.ormRepository.findOne({
      where: { refresh_token: token },
    });

    return foundToken;
  }

  public async findByAccessToken(
    token: string,
  ): Promise<AuthenticationToken | undefined> {
    const foundToken = await this.ormRepository.findOne({
      where: { access_token: token },
    });

    return foundToken;
  }

  public async create({
    access_token,
    expires_in,
    is_active,
    refresh_token,
    user_id,
  }: ICreateRefreshTokenDTO): Promise<AuthenticationToken> {
    const newToken = this.ormRepository.create({
      access_token,
      expires_in,
      is_active,
      refresh_token,
      user_id,
    });

    await this.ormRepository.save(newToken);

    return newToken;
  }

  public async save(data: AuthenticationToken): Promise<AuthenticationToken> {
    return this.ormRepository.save(data);
  }
}

export default RefreshTokensRepository;
