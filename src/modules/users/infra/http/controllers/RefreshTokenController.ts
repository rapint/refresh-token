import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateRefreshTokenService from '@modules/users/services/UpdateRefreshTokenService';

export default class UserRefreshTokenController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { refreshToken } = request.body;

    const updateRefreshToken = container.resolve(UpdateRefreshTokenService);

    const user = await updateRefreshToken.execute(refreshToken);

    return response.json(classToClass(user));
  }
}
