import request from 'supertest';

describe('API Test - Create Object', () => {
  it('should create object successfully when given valid input', async (done) => {
    request(process.env.API_BASE_URL)
      .post('/object')
      .send({ key: 'value1' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.key).toEqual('key');
        expect(response.body.value).toEqual('value1');
        expect(response.body.timestamp).not.toBeNull();
        done();
      });
  });

  it('should return error when given empty object', async (done) => {
    request(process.env.API_BASE_URL)
      .post('/object')
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err, response) => {
        expect(response.body.error).toEqual('"value" must have at least 1 key');
        done();
      });
  });

  it('should return error when given more than one object', async (done) => {
    request(process.env.API_BASE_URL)
      .post('/object')
      .send({ key1: 'value1', key2: 'value2' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err, response) => {
        expect(response.body.error).toEqual(
          '"value" must have less than or equal to 1 key',
        );
        done();
      });
  });
});
