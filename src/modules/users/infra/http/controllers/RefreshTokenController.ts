import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateRefreshTokenService from '@modules/users/services/UpdateRefreshTokenService';
import InvalidateRefreshTokenService from '@modules/users/services/InvalidateRefreshTokenService';

export default class UserRefreshTokenController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { refreshToken } = request.body;

    const updateRefreshToken = container.resolve(UpdateRefreshTokenService);

    const user = await updateRefreshToken.execute(refreshToken);

    return response.json(classToClass(user));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const token = request.headers.authorization;

    const invalidateRefreshToken = container.resolve(
      InvalidateRefreshTokenService,
    );

    await invalidateRefreshToken.execute({
      userId,
      accessToken: token as string,
    });

    return response.status(204).json();
  }
}
