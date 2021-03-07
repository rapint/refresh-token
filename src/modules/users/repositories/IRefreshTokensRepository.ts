import ICreateRefreshTokenDTO from '../dtos/ICreateRefreshTokenDTO';
import RefreshToken from '../infra/typeorm/entities/RefreshToken';

export default interface IRefreshTokensRepository {
  findByUserId(id: string): Promise<RefreshToken | undefined>;
  findByRefreshToken(token: string): Promise<RefreshToken | undefined>;
  findByAccessToken(token: string): Promise<RefreshToken | undefined>;
  create(data: ICreateRefreshTokenDTO): Promise<RefreshToken>;
  save(data: RefreshToken): Promise<RefreshToken>;
}
