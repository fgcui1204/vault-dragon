import request from 'supertest';

const now = new Date().getTime();
describe('API Test - Retrieve Object', () => {
  beforeAll((done) => {
    request(process.env.API_BASE_URL)
      .post('/object')
      .send({ key: `value at ${now}` })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('should retrieve object successfully when given valid input', async (done) => {
    request(process.env.API_BASE_URL)
      .get('/object/key')
      .send()
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.key).toEqual(`value at ${now}`);
        done();
      });
  });

  it('should return error when given invalid timestamp', async (done) => {
    request(process.env.API_BASE_URL)
      .get('/object/key?timestamp=abc')
      .send()
      .expect('Content-Type', /json/)
      .expect(422, done);
  });

  it('should return not found when given invalid key', async (done) => {
    request(process.env.API_BASE_URL)
      .get('/object/not-exist-key')
      .send()
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, response) => {
        expect(response.body.error).toEqual(
          'Could not find object with provided key: not-exist-key',
        );
        done();
      });
  });
});
