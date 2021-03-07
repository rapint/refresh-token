import { Router } from 'express';

import SessionController from '../controllers/SessionController';
import RefreshTokenController from '../controllers/RefreshTokenController';

import { create, refreshToken } from './validations/sessions.validation';

const sessionsRouter = Router();

const sessionController = new SessionController();
const refreshTokenController = new RefreshTokenController();

sessionsRouter.post('/', create, sessionController.create);

sessionsRouter.put(
  '/refresh-token',
  refreshToken,
  refreshTokenController.update,
);

export default sessionsRouter;
