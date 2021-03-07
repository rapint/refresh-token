import { Joi, Segments, celebrate } from 'celebrate';

const create = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  },
});

export default create;
