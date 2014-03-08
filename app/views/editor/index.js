var BaseView = require('../base'),
    _        = require('underscore'),
    Code     = require('../../models/code');

module.exports = BaseView.extend({
  className: 'editor_index_view',

  //TODO: 固定ではなくパラメータからsetするように変える
  fileName: 'bar.js',
  unique:   '6hck4e',
  token:    'y0zdzw2xs6n42pj97aby6zugdbmwnyttcjphobhh',
  body:     '',

  /*
   * コードを保存する
   */
  update: function(evt) {
    console.log('update');
    var that = this;
    var code = new Code({
      'unique': this.unique,
      'token':  this.token,
      'body':   this.body
      //TODO: fileNameも保存したい
    });
    code.save();
  },

  /*
   * 読み込み許可するファイルタイプか？
   */
  isValidFileType: function(fileType) {
    var validFileTypes = [
      '', // .less や .conf が空文字になるため
      'application/json'
    ];
    if (fileType.match(/text.*/)) {
      return true;
    }
    if (_.contains(validFileTypes, fileType)) {
      return true;
    }
    return false;
  },

  handleDragleave: function(evt) {
    $('#editor').removeClass('over');
  },

  handleDragover: function(evt) {
    $('#editor').addClass('over');
  },

  handleDrop: function(evt) {
    $('#editor').removeClass('over');
    var that = this;
    clearInterval(that.intervalId);
    var f = evt.dataTransfer.files[0];

    if (!that.isValidFileType(f.type)) {
      console.log(f.type);
      alert('Only text file.');
      return;
    }

    var mode = modelist.getModeForPath(f.name);
    that.editor.getSession().setMode(mode.mode);

    that.reader = new FileReader();
    that.fileName = f.name;
    $('#file-name').text(f.name);

    that.lastMod = f.lastModifiedDate;

    that.intervalId = setInterval(function() {
      that.tick(f);
    }, 250);

    that.reader.onload = function(evt) {
      that.handleLoadReader(evt);
    };

    that.reader.readAsText(f);
  },

  handleLoadReader: function(evt) {
    var that = this;
    that.body = that.reader.result;
    that.editor.setValue(that.body);
    that.editor.clearSelection();
    that.update();
  },

  setEditor: function() {
    var that = this,
        theme = 'ace/theme/ambiance',
        defaultMode = 'ace/mode/text';

    that.editor = ace.edit("editor");
    that.editor.setReadOnly(true);
    that.editor.setPrintMarginColumn(false);
    that.editor.setTheme(theme);
    //TODO: modelにfileNameが存在する場合はmodelistから設定したい
    that.editor.getSession().setMode(defaultMode);
  },

  lastMod: '',

  tick: function(f) {
    var that = this;
    if (f && f.lastModifiedDate.getTime() != that.lastMod.getTime()) {
      that.lastMod = f.lastModifiedDate;
      that.handleLoadReader();
      that.reader.readAsText(f);
    }
  },

  /*
   * Environment: client.
   */
  postRender: function() {
    var that = this;
    $.event.props.push("dataTransfer");
    that.setEditor();
    $editor = $('#editor');

    $editor.on('drop', function(evt) {
      evt.preventDefault();
      that.handleDrop(evt);
    });

    $editor.on('dragleave', function(evt) {
      evt.preventDefault();
      that.handleDragleave(evt);
    });

    $editor.on('dragover', function(evt) {
      evt.preventDefault();
      that.handleDragover(evt);
    });
  },

  /*
   * Environment: shared.
   */
  getTemplateData: function() {

    var data = BaseView.prototype.getTemplateData.call(this);

    data = _.extend({}, data, {
      code: this.options.code.toJSON()
    });

    return data;
  }

});

module.exports.id = 'editor/index';
console.log("editor view");

