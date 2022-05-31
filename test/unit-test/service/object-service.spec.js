import dynamodb from 'serverless-dynamodb-client';
import { getObject, createObject } from '../../../src/service/object-service';

jest.mock('serverless-dynamodb-client');
jest.mock('uuid', () => {
  return {
    v4: () => '0550dfa7-8d33-4fb3-8448-523614c75b49',
  };
});
jest.mock('lodash/date', () => {
  return {
    now: () => 1653838910319,
  };
});
const objectKey = 'objectKey';

describe('ObjectService', () => {
  const timestamp = 1653838910319;
  const mockPromise = jest.fn();
  describe('GetObject', () => {
    dynamodb.doc.query.mockImplementation(() => ({
      promise: mockPromise,
    }));
    it('should return last object when given timestamp', async () => {
      mockPromise.mockResolvedValueOnce({
        Items: [
          {
            objectValue: 2132131,
            objectId: '671d990c-b093-4e3f-b959-87681e82ae2e',
            objectKey: 'objectKey',
            timestamp: 1653838900219,
          },
          {
            objectValue: 2132131,
            objectId: '671d990c-b093-4e3f-b959-87681e82ae2e',
            objectKey: 'objectKey',
            timestamp: 1653838910219,
          },
          {
            objectValue: 2132131,
            objectId: '671d990c-b093-4e3f-b959-87681e82ae2e',
            objectKey: 'objectKey',
            timestamp: 1653838920219,
          },
        ],
      });

      const result = await getObject(objectKey, timestamp);

      expect(dynamodb.doc.query).toHaveBeenCalledTimes(1);
      expect(dynamodb.doc.query).toHaveBeenCalledWith({
        TableName: 'objects_table',
        ExpressionAttributeValues: {
          ':objectKey': objectKey,
        },
        IndexName: 'objectKeyIndex',
        KeyConditionExpression: 'objectKey = :objectKey',
      });
      expect(result).toEqual({
        objectId: '671d990c-b093-4e3f-b959-87681e82ae2e',
        objectKey,
        objectValue: 2132131,
        timestamp: 1653838910219,
      });
    });

    it('should return empty object when given an earlier timestamp', async () => {
      const earlierTimestamp = 1643838910319;
      mockPromise.mockResolvedValueOnce({
        Items: [
          {
            objectValue: 2132131,
            objectId: '671d990c-b093-4e3f-b959-87681e82ae2e',
            objectKey: 'objectKey',
            timestamp: 1653838900219,
          },
          {
            objectValue: 2132131,
            objectId: '671d990c-b093-4e3f-b959-87681e82ae2e',
            objectKey: 'objectKey',
            timestamp: 1653838910219,
          },
        ],
      });

      const result = await getObject(objectKey, earlierTimestamp);

      expect(result).toBeUndefined();
    });
  });

  describe('CreateObject', () => {
    const objectValue = 'objectValue';
    dynamodb.doc.put.mockImplementation(() => ({
      promise: mockPromise,
    }));

    it('should return object when create successfully', async () => {
      mockPromise.mockResolvedValueOnce('success');

      const result = await createObject(objectKey, objectValue);

      expect(dynamodb.doc.put).toHaveBeenCalledTimes(1);
      expect(dynamodb.doc.put).toHaveBeenCalledWith({
        TableName: 'objects_table',
        Item: {
          objectId: '0550dfa7-8d33-4fb3-8448-523614c75b49',
          objectKey,
          objectValue,
          timestamp,
        },
      });
      expect(result).toEqual({
        objectId: '0550dfa7-8d33-4fb3-8448-523614c75b49',
        objectKey,
        objectValue,
        timestamp,
      });
    });

    it('should return error when downstream failed', async () => {
      mockPromise.mockRejectedValue(new Error('error'));

      await expect(() => createObject(objectKey, objectValue)).rejects.toThrow(
        new Error('error'),
      );
    });
  });
});
