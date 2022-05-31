import express from 'express';
import serverless from 'serverless-http';
import {
  createObjectHandler,
  retrieveObjectHandler,
} from './handler/object-handler';
import { joiMiddleware } from './util/joi-middleware';
import { createObjectSchema, retrieveObjectSchema } from './util/schema';

const app = express();

app.use(express.json());

app.get(
  '/object/:key',
  joiMiddleware(retrieveObjectSchema, 'query'),
  async (req, res) => retrieveObjectHandler(req, res),
);

app.post(
  '/object',
  joiMiddleware(createObjectSchema, 'body'),
  async (req, res) => createObjectHandler(req, res),
);

app.use((req, res) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

module.exports.handler = serverless(app);
