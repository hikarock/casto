var BaseView = require('../base'),
    _        = require('underscore'),
    Code     = require('../../models/code');


module.exports = BaseView.extend({
  className: 'editor_index_view',

  postInitialize: function() {
    //
  },

  //TODO:
  unique: '6hck4e',
  token:  'y0zdzw2xs6n42pj97aby6zugdbmwnyttcjphobhh',
  body:   '',

  update: function(evt) {
    console.log('update');
    var self = this;
    var code = new Code({
      'unique': this.unique,
      'token':  this.token,
      'body':   this.body
      //TODO: fileNameも保存したい
    });

    code.save();
  },

  //TODO:
  fileName: 'bar.js',

  postRender: function() {
    console.log("editor view postRender");

    var self = this;
    $.event.props.push("dataTransfer");

    var editor = ace.edit("editor");
    editor.setReadOnly(true);
    editor.setPrintMarginColumn(false);
    editor.setTheme("ace/theme/ambiance");

    $('#editor').on('drop', function(evt) {
      evt.preventDefault();
      $(this).removeClass('over');
      var files = evt.dataTransfer.files;
      var f = files[0];

      //TODO:
      if (self.getExtention(f.name) == 'js') {
        editor.getSession().setMode("ace/mode/javascript");
      }

      var reader = new FileReader();

      if (!f.type.match('text.*')) {
        alert('Only text file.');
        return;
      }

      self.fileName = f.name;

      lastMod = f.lastModifiedDate;

      setInterval(function() {
        tick(f);
      }, 250);

      reader.onload = function(evt) {
        self.body = reader.result;
        editor.setValue(self.body);
        editor.clearSelection();
      };

      reader.readAsText(f);
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
          self.body = reader.result;
          editor.setValue(self.body);
          editor.clearSelection();
          self.update();
        };
        reader.readAsText(f);
      }
    };
  },

  getTemplateData: function() {

    var data = BaseView.prototype.getTemplateData.call(this);

    data = _.extend({}, data, {
      code: this.options.code.toJSON()
    });

    return data;
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


