var RendrView = require('rendr/shared/base/view');

module.exports = RendrView.extend({
  getTemplateData: function() {
    return {
      version:     0.1,
      appName:     'casto',
      apiName:     'Storyboards',
      apiUrl:      'http://www.storyboards.jp',
      description: 'hello world.'
    };
  }
});
