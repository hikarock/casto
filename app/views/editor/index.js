var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'editor_index_view',
  input: "hello",
  postRender: function() {
    console.log("editor view postRender");
    $.event.props.push("dataTransfer");

    $('#drop').on('drop', function(evt) {
      evt.preventDefault();
      $(this).removeClass('over');
      var files = evt.dataTransfer.files;
      for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var reader = new FileReader();
        if (f.type.match('text.*')) {
          lastMod = f.lastModifiedDate;
          setInterval(function() {
            tick(f);
          }, 250);
          reader.onload = function (evt) {
            $('#editor').text(reader.result);
          };
          reader.readAsText(f);
        }
      }
    });

    $('#drop').on('dragleave', function(evt) {
      $(this).removeClass('over');
      evt.preventDefault();
    });

    $('#drop').on('dragover', function(evt) {
      $(this).addClass('over');
      evt.preventDefault();
    });

    var lastMod;
    var tick = function(f) {
      if (f && f.lastModifiedDate.getTime() != lastMod.getTime()) {
        lastMod = f.lastModifiedDate;
        console.log(f.lastModifiedDate + ":" + lastMod);
        var reader = new FileReader();
        reader.onload = function (evt) {
          $('#editor').text(reader.result);
        };
        reader.readAsText(f);
      }
    };
  },

  getTemplateData: function() {
    return {
      text: this.input
    };
  }
});
module.exports.id = 'editor/index';
console.log("editor view");


