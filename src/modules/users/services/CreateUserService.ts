import AppError from '@shared/errors/AppError';

import {
  IFindUserByEmailRepository,
  ICreateUserRepository,
} from '../repositories';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { IUserModel } from '../models/IUserModel';

interface IRequest {
  email: string;
  password: string;
  name: string;
}

export class CreateUserService {
  constructor(
    private readonly findUserByEmailRepository: IFindUserByEmailRepository,
    private readonly createUserRepository: ICreateUserRepository,
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
    name,
  }: IRequest): Promise<IUserModel> {
    const checkUserExists = await this.findUserByEmailRepository.find(email);

    if (checkUserExists) {
      throw new AppError('Email já cadastrado no sistema.', 409);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.createUserRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return user;
  }
}
