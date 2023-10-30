const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Replace with the path to your Express app

const mongoServer = new MongoMemoryServer();

describe('Blog API Endpoints', () => {
  let server;
  let authToken;

  before(async () => {
    const uri = await mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let authToken
    
    const loginResponse = await request(app)
      .post('/users/login') 
      .send({ email: 'testuser@example.com', password: 'testpassword' });

    authToken = loginResponse.body.token;
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create a new blog', (done) => {
    request(app)
      .post('/blogs/create')
      .set('x-auth-token', authToken)
      .send({
        title: 'Test Blog',
        description: 'A test blog',
        tags: ['test', 'sample'],
        body: 'This is a test blog body.',
      })
      .expect(201, done);
  });

  it('should get a single blog by ID', (done) => {
    request(app)
      .get('/blogs12345667') 
      .expect(200, done);
  });

  it('should update the state of a blog to "published"', (done) => {
    request(app)
      .put('/blogs/123455/publish') 
      .set('x-auth-token', authToken)
      .expect(200, done);
  });

  it('should edit a blog', (done) => {
    request(app)
      .put('/blogs/:1234567') 
      .set('x-auth-token', authToken)
      .send({
        title: 'Edited Blog',
        description: 'An edited blog',
        tags: ['edited', 'sample'],
        body: 'This is an edited blog body.',
      })
      .expect(200, done);
  });

  it('should delete a blog', (done) => {
    request(app)
      .delete('/blogs/:1234456') 
      .set('x-auth-token', authToken)
      .expect(204, done);
  });
});
