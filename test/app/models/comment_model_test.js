var Comment = require('../../../app/models/comment'),
    should = require('should');

describe('Comment model spec', function() {
  it('should be settable code.', function() {
    var comment = new Comment({comment: "test comment", owner: true});
    comment.get("comment").should.equal('test comment');
    comment.get("owner").should.equal(true);
  });

  it('should be raise error set long comment.', function() {
      var longComment = "",
          i=0,
          maxLength = 1024;

      for(i=0; i<maxLength + 1; i++) {
        longComment += "A";
      }

      var comment = new Comment({comment: longComment});
      comment.isValid().should.false;
  });

  it('need owner flag.', function() {
    var comment = new Comment({comment: "Hi"});
    comment.isValid().should.false;
  });
});

