import ICreateRefreshTokenDTO from '../dtos/ICreateRefreshTokenDTO';
import { IRefreshTokenModel } from '../models/IRefreshTokenModel';

export default interface IRefreshTokensRepository {
  findByUserId(id: string): Promise<IRefreshTokenModel | undefined>;
  findByRefreshToken(token: string): Promise<IRefreshTokenModel | undefined>;
  findByAccessToken(token: string): Promise<IRefreshTokenModel | undefined>;
  create(data: ICreateRefreshTokenDTO): Promise<IRefreshTokenModel>;
  save(data: IRefreshTokenModel): Promise<IRefreshTokenModel>;
}
