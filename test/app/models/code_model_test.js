var Code = require('../../../app/models/code'),
    should = require('should');

describe('CodeModel', function() {
  it('should be settable code.', function() {
    var model = new Code({code: "test code"});
    model.attributes.code.should.equal('test code');
  });
});

