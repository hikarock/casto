var Base = require('./base');

module.exports = Base.extend({
  url: '/castoapi/code/:unique',
  api: 'storyboards'
});
module.exports.id = 'Code';

