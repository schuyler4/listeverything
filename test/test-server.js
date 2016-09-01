const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const should = chai.should();
chai.use(chaiHttp);

describe('Lists', function() {
  it('should list ALL Lists on /listOflists GET', function(done) {
    chai.request('http://localhost:3000/listOflists')
    .get('/listOflists')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });
  it('should add a SINGLE list on /addList POST', function(done) {
    chai.request('http://localhost:3000/addList')
    .post('/addList')
    .send({"title":"test title"})
    .expect(200)
    .end(function(err, res) {
        if (err) done(err);
        expect(true).to.be.true;
        res.should.have.status(200);
        res.body.should.have.property('title');
        done();
    });
  });
  it('should show a SINGLE list on /list/<title>/<id> GET', function(done) {
    chai.request('http://localhost:3000/list/:title/:id')
    .get('/list/:title/:id')
    .end(function(err, res) {
      res.should.have.status(200);
      done()
    });
  });
  it('shou')
  it('should update a SINGLE blob on /addItems POST');
});
