import { container } from 'tsyringe';

import '@modules/users/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IRefreshTokensRepository from '@modules/users/repositories/IRefreshTokensRepository';
import RefreshTokensRepository from '@modules/users/infra/typeorm/repositories/RefreshTokensRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IRefreshTokensRepository>(
  'RefreshTokensRepository',
  RefreshTokensRepository,
);
