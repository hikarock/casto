var Code = require('../../../app/models/code'),
    should = require('should');

describe('CodeModel', function() {
  it('should be settable code.', function() {
    var code = new Code({body: "test code"});
    code.get("body").should.equal('test code');
  });

  it('should be raise error set long code.', function() {
      var longCode = "",
          i=0,
          maxLength = 500 * 1024;

      for(i=0; i<maxLength + 1; i++) {
        longCode += "A";
      }

      var code = new Code({body: longCode});
      code.isValid().should.false;
  });
});

