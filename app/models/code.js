var Base = require('./base');

module.exports = Base.extend({
  url: '/castoapi/code/:unique',
  api: 'storyboards',
  idAttribute: 'unique'
});
module.exports.id = 'Code';
