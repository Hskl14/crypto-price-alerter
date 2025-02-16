const request = require('supertest');
const app = require('../app');

describe('User Authentication', () => {
  it('Should register a new user and return JWT', async () => {
    const res = await request(app)
      .post('/api/v1/user/register')
      .send({
        email: 'testuser+001@gmail.com',
        password: 'superpassword123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('Should login a user and return a JWT', async () => {
    const res = await request(app)
      .post('/api/v1/user/login')
      .send({
        email: 'testuser+001@gmail.com',
        password: 'superpassword123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
