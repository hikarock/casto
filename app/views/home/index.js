var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'home_index_view',
  postRender: function() {
    var intervalId;
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
      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = setInterval(function(){
        $('#cli-usage a span').toggleClass('last-letter');
      }, 300);
    });
    $('#show-cli-demo').on('click', function(evt) {
      evt.preventDefault();
      $('#cli-demo').show();
    });
    $('#cli-demo').on('click', function(evt) {
      evt.preventDefault();
      $('#cli-demo').hide();
    });
    var description = $('#description-text').text();
    $('#description').typed({
      strings: [description],
      typeSpeed: 0
    });
  }
});
module.exports.id = 'home/index';
