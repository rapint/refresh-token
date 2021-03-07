import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';
import ShowUserService from '@modules/users/services/ShowUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password, name } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      email,
      password,
      name,
    });

    return response.status(201).json(classToClass(user));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;

    const getUser = container.resolve(ShowUserService);

    const user = await getUser.execute(userId);

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const { email, password, oldPassword, name } = request.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      email,
      password,
      userId,
      oldPassword,
      name,
    });

    return response.json(classToClass(user));
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const { id: userId } = request.user;

    const deleteUser = container.resolve(DeleteUserService);

    await deleteUser.execute(userId);

    response.status(204).json();
  }
}
