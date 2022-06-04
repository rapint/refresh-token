import AppError from '@shared/errors/AppError';
import { IUserModel } from '../models/IUserModel';

import { IFindUserByIdRepository } from '../repositories';

export class ShowUserService {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepository,
  ) {}

  public async execute(userId: string): Promise<IUserModel> {
    const user = await this.findUserByIdRepository.find(userId);

    if (!user) {
      throw new AppError('Usuário não foi encontrado.', 404);
    }

    return user;
  }
}
