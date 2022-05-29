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
      .expect(422, done);
  });
});
