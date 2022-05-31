import dynamodb from 'serverless-dynamodb-client';
import { v4 as uuidv4 } from 'uuid';
import { filter, orderBy } from 'lodash/collection';
import { head } from 'lodash/array';
import { now } from 'lodash/date';
import { logger } from '../util/logger';

const { OBJECTS_TABLE } = process.env;

const dynamoDbClient = dynamodb.doc;

export const getObject = async (objectKey, timeStamp) => {
  const params = {
    TableName: OBJECTS_TABLE,
    IndexName: 'objectKeyIndex',
    KeyConditionExpression: 'objectKey = :objectKey',
    ExpressionAttributeValues: { ':objectKey': objectKey },
  };

  const { Items } = await dynamoDbClient.query(params).promise();

  return head(
    orderBy(
      filter(Items, (item) => item.timestamp <= timeStamp),
      ['timestamp'],
      'desc',
    ),
  );
};

export const createObject = async (objectKey, objectValue) => {
  const params = {
    TableName: OBJECTS_TABLE,
    Item: {
      objectId: uuidv4(),
      objectKey,
      objectValue,
      timestamp: now(),
    },
  };
  await dynamoDbClient.put(params).promise();

  logger.info(
    'Create object successfully with params: %s',
    JSON.stringify(params),
  );

  return params.Item;
};
