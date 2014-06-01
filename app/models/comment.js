var Base = require('./base');

module.exports = Base.extend({
  validate: function(attrs, options) {
    if (attrs.comment.length > 512) {
      return "comment length too large.";
    }

    if (typeof attrs.owner != 'boolean') {
      return "need owner flag.";
    }
  },
  url: '/castoapi/comment/:unique',
  api: 'storyboards',
  idAttribute: 'unique'
});
module.exports.id = 'Comment';
