var BaseView = require('../base'),
    _ = require('underscore'),
    Code = require('../../models/code');

module.exports = BaseView.extend({
  className: 'editor_index_view',
  update: function(evt) {
    console.log("update");
    console.log(evt);

    //-- Rendr model save sample.
    //var code = new Code({"unique":"1rzj6w", "body":"gegege", "token":"qbnk088bmy3isf1h32u9pdus1q0zjzr6a4iir7dv"});
    //code.save();
  },

  //TODO:
  fileName: 'bar.js',

  postRender: function() {
    var self = this;
    $.event.props.push("dataTransfer");
    var editor = ace.edit("editor");
    editor.setReadOnly(true);
    editor.setPrintMarginColumn(false);
    editor.setTheme("ace/theme/ambiance");

    console.log("editor view postRender");

    $('#editor').on('drop', function(evt) {
      evt.preventDefault();
      $(this).removeClass('over');
      var files = evt.dataTransfer.files;
      var f = files[0];

      //TODO:
      if (self.getExtention(f.name) == 'js') {
        editor.getSession().setMode("ace/mode/javascript");
      }
      console.log(f);
      var reader = new FileReader();
      if (f.type.match('text.*')) {
        lastMod = f.lastModifiedDate;
        setInterval(function() {
          tick(f);
        }, 250);
        reader.onload = function (evt) {
          editor.setValue(reader.result);
          editor.clearSelection();
        };
        reader.readAsText(f);
      }
    });

    $('#editor').on('dragleave', function(evt) {
      $(this).removeClass('over');
      evt.preventDefault();
    });

    $('#editor').on('dragover', function(evt) {
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
          editor.setValue(reader.result);
          editor.clearSelection();
          self.update();
        };
        reader.readAsText(f);
      }
    };
  },

  getTemplateData: function() {
    var data = BaseView.prototype.getTemplateData.call(this);
    return _.extend({}, data, {
      fileName: this.fileName
    });
  },

  getExtention: function(fileName) {
    var ret;
    if (!fileName) {
      return ret;
    }
    var fileTypes = fileName.split(".");
    var len = fileTypes.length;
    if (len === 0) {
      return ret;
    }
    ret = fileTypes[len - 1];
    return ret;
  }
});

module.exports.id = 'editor/index';
console.log("editor view");


