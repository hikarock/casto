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
    $('#show-cli-demo').leanModal();
    var description = $('#description-text').text();
    $('#description').typed({
      strings: [description],
      typeSpeed: 0
    });
  }
});
module.exports.id = 'home/index';
