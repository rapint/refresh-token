import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController';

import { create, update } from './validations/users.validation';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', create, usersController.create);

usersRouter.use(ensureAuthenticated);

usersRouter.get('/', usersController.show);

usersRouter.put('/', update, usersController.update);

export default usersRouter;
