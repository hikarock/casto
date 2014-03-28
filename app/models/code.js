var Base = require('./base');

module.exports = Base.extend({
  validate: function(attrs, options) {
    if (attrs.body.length > 500 * 1024) {
      return "code length too large.";
    }
  },
  url: '/castoapi/code/:unique',
  api: 'storyboards',
  idAttribute: 'unique'
});
module.exports.id = 'Code';
