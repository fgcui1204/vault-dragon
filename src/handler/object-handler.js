import { get, keys } from 'lodash';
import { head } from 'lodash/array';
import { values } from 'lodash/object';
import { now } from 'lodash/date';
import { createObject, getObject } from '../service/object-service';
import { logger } from '../util/logger';

export const retrieveObjectHandler = async (req, res) => {
  try {
    const objectKey = get(req.params, 'key');
    const timeStamp = get(req.query, 'timestamp', now());

    const object = await getObject(objectKey, timeStamp);

    if (object) {
      // eslint-disable-next-line no-shadow
      const { objectKey, objectValue } = object;
      res.json({ [objectKey]: objectValue });
    } else {
      res.status(404).json({
        error: `Could not find object with provided key: ${objectKey}`,
      });
    }
  } catch (error) {
    logger.error('Error happened when retrieve object.');
    res.status(500).json({ error: 'Could not retrieve object' });
  }
};

export const createObjectHandler = async (req, res) => {
  try {
    const objectKey = head(keys(req.body));
    const objectValue = head(values(req.body));

    const object = await createObject(objectKey, objectValue);
    res.json({
      key: objectKey,
      value: objectValue,
      timestamp: object.timestamp,
    });
  } catch (error) {
    logger.error('Error happened when create object.');
    res.status(500).json({ error: 'Could not create object' });
  }
};
