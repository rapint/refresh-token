import { Router } from 'express';

import SessionController from '../controllers/SessionController';

import create from './validations/sessions.validation';

const sessionsRouter = Router();

const sessionController = new SessionController();

sessionsRouter.post('/', create, sessionController.create);

export default sessionsRouter;
