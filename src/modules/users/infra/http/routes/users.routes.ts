import { Router } from 'express';

import UsersController from '../controllers/UsersController';

import create from './validations/users.validation';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', create, usersController.create);

export default usersRouter;
