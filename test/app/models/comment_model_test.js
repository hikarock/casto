var Comment = require('../../../app/models/comment'),
    should = require('should');

describe('Comment model spec', function() {
  it('should be settable code.', function() {
    var comment = new Comment({comment: "test comment"});
    comment.get("comment").should.equal('test comment');
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
});

