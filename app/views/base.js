var RendrView = require('rendr/shared/base/view');
var _ = require('underscore');

// Create a base view, for adding common extensions to our
// application's views.
module.exports = RendrView.extend({
  getTemplateData: function() {
    var data = RendrView.prototype.getTemplateData.call(this);
    return _.extend({}, data, {
      version:     '0.2.0',
      appName:     'Casto',
      apiName:     'Stobo',
      apiUrl:      'http://www.storyboards.jp',
      description: 'Live coding in browse, using text editor.'
    });
  }
});


