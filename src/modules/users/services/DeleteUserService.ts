import AppError from '@shared/errors/AppError';

import {
  IFindUserByIdRepository,
  IRemoveUserRepository,
} from '../repositories';

export class DeleteUserService {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepository,
    private readonly removeUserRepository: IRemoveUserRepository,
  ) {}

  public async execute(userId: string): Promise<void> {
    const user = await this.findUserByIdRepository.find(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    await this.removeUserRepository.remove(user);
  }
}
