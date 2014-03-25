var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'home_index_view',
  postRender: function() {
    for (var i = 0; i < 100; i++) {
      $('#line-number').append($('<li>'));
    }
    $('#start').on('click', function(evt) {
      evt.preventDefault();
      location.href = $(this).attr('href');
    });
  }
});
module.exports.id = 'home/index';
