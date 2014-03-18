var Base = require('./base');

module.exports = Base.extend({
  url: '/castoapi/token',
  api: 'storyboards',
  idAttribute: 'unique'
});

module.exports.id = 'Token';

