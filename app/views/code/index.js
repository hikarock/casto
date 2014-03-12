var BaseView = require('../base'),
    _        = require('underscore'),
    Code     = require('../../models/code');

module.exports = BaseView.extend({
  className: 'code_index_view',
  initialize: function() {
    console.log("init");
  },

  /*
   * コードを保存する
   */
  update: function(evt) {
    console.log('update');
    var code = new Code({
      'unique':   this.unique,
      'token':    this.token,
      'body':     this.body,
      'filename': this.filename
    }, {
      app: this.app
    });
    code.save();
  },

  /*
   * 読み込み許可するファイルタイプか？
   */
  isValidFileType: function(fileType) {
    var validFileTypes = [
      '', // .less や .conf が空文字になるため
      'application/json',
      'image/svg+xml'
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
    var that = this,
        mode,
        file = evt.dataTransfer.files[0];

    clearInterval(that.intervalId);

    if (!that.isValidFileType(file.type)) {
      console.log(file.type);
      alert('Only text file.');
      return;
    }

    mode = modelist.getModeForPath(file.name);
    that.editor.getSession().setMode(mode.mode);

    that.reader = new FileReader();
    that.filename = file.name;
    $('#filename').text(file.name);

    that.lastMod = file.lastModifiedDate;

    that.intervalId = setInterval(function() {
      that.tick(file);
    }, 250);

    that.reader.onload = function(evt) {
      that.handleLoadReader(evt);
    };

    that.reader.readAsText(file);
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
        mode = modelist.getModeForPath(this.filename);

    console.log(mode);

    that.editor = ace.edit("editor");
    that.editor.setReadOnly(true);
    that.editor.setPrintMarginColumn(false);
    that.editor.setTheme(theme);
    that.editor.getSession().setMode(mode.mode);
  },

  // 読込中のファイルの最終更新日時
  lastMod: '',

  tick: function(file) {
    var that = this;
    if (file && file.lastModifiedDate.getTime() != that.lastMod.getTime()) {
      that.lastMod = file.lastModifiedDate;
      that.handleLoadReader();
      that.reader.readAsText(file);
    }
  },

  /*
   * Environment: client.
   */
  postRender: function() {
    var that = this,
        $editor = $('#editor');

    // drag & drop のイベントを追加
    $.event.props.push("dataTransfer");

    console.log(this.app);

    that.filename = 'hoge.html';
    that.setEditor();

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
  }
});
module.exports.id = 'code/index';
