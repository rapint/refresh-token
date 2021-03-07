import { Joi, Segments, celebrate } from 'celebrate';

export const create = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  },
});

export const update = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().required(),
    oldPassword: Joi.string(),
    password: Joi.string().when('oldPassword', {
      is: Joi.exist(),
      then: Joi.required(),
    }),
    passwordConfirmation: Joi.string()
      .valid(Joi.ref('password'))
      .when('password', { is: Joi.exist(), then: Joi.required() }),
  },
});
