import { getMockReq, getMockRes } from '@jest-mock/express';
import { getObject, createObject } from '../../src/service/object-service';
import {
  createObjectHandler,
  retrieveObjectHandler,
} from '../../src/handler/object-handler';

jest.mock('../../src/service/object-service', () => {
  const original = jest.requireActual('../../src/service/object-service');
  return {
    ...original,
    getObject: jest.fn(),
    createObject: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

const { res } = getMockRes();
describe('objectHandler', () => {
  describe('retrieveObjectHandler', () => {
    it('should return object when retrieve object and given valid input', async () => {
      const request = getMockReq({ params: { key: 'objectKey' } });
      getObject.mockImplementation(() => ({
        objectKey: 'objectKey',
        objectValue: 'objectValue',
      }));

      await retrieveObjectHandler(request, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ objectKey: 'objectValue' }),
      );
    });

    it('should return not found when retrieve object return empty', async () => {
      const request = getMockReq({ params: { key: 'notExistKey' } });
      getObject.mockImplementation(() => {});

      await retrieveObjectHandler(request, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Could not find object with provided key: notExistKey',
        }),
      );
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return error when downstream occur error', async () => {
      const request = getMockReq({ params: { key: 'errorKey' } });
      getObject.mockImplementation(() => {
        throw new Error('error');
      });

      await retrieveObjectHandler(request, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Could not retrieve object',
        }),
      );
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
  describe('createObjectHandler', () => {
    it('should create successfully when downstream response ok and given valid input', async () => {
      const request = getMockReq({ body: { myKey: 'myValue' } });
      createObject.mockImplementation(() => ({
        objectKey: 'myKey',
        objectValue: 'myValue',
        timestamp: 1653827580184,
      }));

      await createObjectHandler(request, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'myKey',
          value: 'myValue',
          timestamp: 1653827580184,
        }),
      );
    });

    it('should return error when downstream response failed', async () => {
      const request = getMockReq({ body: { myKey: 'myValue' } });
      createObject.mockImplementation(() => {
        throw new Error('error');
      });

      await createObjectHandler(request, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Could not create object' }),
      );
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
