var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'home_index_view',
  postRender: function() {
    $('#start').on('click', function(evt) {
      evt.preventDefault();
      location.href = '/a';
    });
  }
});
module.exports.id = 'home/index';
