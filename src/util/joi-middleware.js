import { logger } from './logger';

export const joiMiddleware = (schema, property) => {
  return (req, res, next) => {
    let objToValidate;
    switch (property) {
      case 'body':
        objToValidate = req.body;
        break;
      case 'params':
        objToValidate = req.params;
        break;
      case 'query':
        objToValidate = req.query;
        break;
      default:
        objToValidate = {};
        break;
    }
    const { error } = schema.validate(objToValidate);

    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      logger.info('validation failed: %s', message);
      res.status(422).json({ error: message });
    } else {
      next();
    }
  };
};
