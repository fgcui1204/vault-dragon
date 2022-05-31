import Joi from 'joi';

export const createObjectSchema = Joi.object().keys().required().min(1).max(1);
