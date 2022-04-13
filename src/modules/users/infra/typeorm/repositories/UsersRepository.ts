import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import { UserOrm } from '../entities/UserOrm';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<UserOrm>;

  constructor() {
    this.ormRepository = getRepository(UserOrm);
  }

  public async index(): Promise<UserOrm[]> {
    const users = await this.ormRepository.find({
      order: { name: 'ASC' },
    });

    return users;
  }

  public async findById(id: string): Promise<UserOrm | undefined> {
    const user = await this.ormRepository.findOne({
      where: { id },
    });

    return user;
  }

  public async findByEmail(email: string): Promise<UserOrm | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async create({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<UserOrm> {
    const user = this.ormRepository.create({
      email,
      name,
      password,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: UserOrm): Promise<UserOrm> {
    return this.ormRepository.save(user);
  }

  public async remove(user: UserOrm): Promise<void> {
    await this.ormRepository.remove(user);
  }
}

export default UsersRepository;
