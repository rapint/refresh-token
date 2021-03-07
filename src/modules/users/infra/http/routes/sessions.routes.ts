import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

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

sessionsRouter.delete(
  '/logout',
  ensureAuthenticated,
  refreshTokenController.delete,
);

export default sessionsRouter;
