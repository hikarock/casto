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
    $('#cli').on('click', function(evt) {
      evt.preventDefault();
      $('#cli-usage').show();
      setInterval(function(){
        $('#cli-usage a span').toggleClass('last-letter');
      }, 300);
    });
    $('#show-cli-demo').on('click', function(evt) {
      evt.preventDefault();
      $('#cli-demo').show().append($('<img>').attr({
        src: '/images/cli-demo.gif'
      }));
    });
  }
});
module.exports.id = 'home/index';
