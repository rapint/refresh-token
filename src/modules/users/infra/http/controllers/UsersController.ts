import { Request, Response } from 'express';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password, name } = request.body;

    return response.status(201).json({
      email,
      password,
      name,
    });
  }
}
