const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../index'); // Update the import based on your project structure

chai.use(chaiHttp);
const expect = chai.expect;

describe('HealthCheck API', () => {
  // Start the server before the tests run
  before(function(done) {
    if (!server.listening) { // Check if the server is not already listening
      server.listen(3000, done); // Adjust the port number as needed
    } else {
      done();
    }
  });

  // Close the server after the tests finish
  after(function() {
    server.close();
  });

  it('should return suggested conditions for valid symptoms', async () => {
    const res = await chai.request(app)
      .post('/checkHealth')
      .send({ symptoms: ['fever', 'cough'] });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('suggestedConditions').to.be.an('array');
  });

  it('should handle invalid input', function(done) {
    chai.request(app)
      .post('/checkHealth')
      .send({ symptoms: [] }) // sending empty symptoms array to simulate invalid input
      .end(function(err, res) {
        expect(res).to.have.status(400);
        done();
      });
  });
});