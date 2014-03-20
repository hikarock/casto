var BaseView = require('../base'),
    _        = require('underscore');

module.exports = BaseView.extend({
  className: 'code_index_view',

  _PUSHER_API_KEY: 'd3adbb2d6866384d7152',

  /*
   * 読み込み許可するファイルタイプか？
   */
  isValidFileType: function(fileType) {
    var validFileTypes = [
      '', // .less や .conf が空文字になるため
      'application/json',
      'application/msword',
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
    that.model.set('filename', file.name);
    $('#filename').text(file.name);

    that.lastMod = file.lastModifiedDate;

    that.intervalId = setInterval(function() {
      that.tick(file);
    }, 250);

    that.reader.onload = function(evt) {
      that.handleLoadReader();
    };

    that.reader.readAsText(file);
  },

  handleLoadReader: function(code) {

    var that = this,
        body, diff, token;

    if (arguments.length === that.handleLoadReader.length) {
      body = code;
    } else {
      body = that.reader.result;
    }

    diff = JsDiff.diffLines(that._body, body);

    that._body = body;
    that.editor.setValue(body);
    that.editor.clearSelection();
    that.editor.$search.find(that.editor.getSession());

    _.each(diff, function(d) {
      if (d.added) {
        that.editor.find(d.value);
      }
    });

    that.model.set('body', body);
    token = that.model.get('token');
    if (token) {
      this.model.save();
    }
  },

  setEditor: function() {
    var that  = this,
        theme = 'ace/theme/ambiance';
        mode  = 'Text';

    if (this.model.get('filename')) {
        mode = modelist.getModeForPath(this.model.get('filename'));
    }

    that.editor = ace.edit('editor');
    that.editor.setReadOnly(true);
    that.editor.setPrintMarginColumn(false);
    that.editor.setTheme(theme);
    that.editor.setSelectionStyle('line');
    that.editor.getSession().setMode(mode.mode);
  },

  setPusher: function() {
    var that = this,
        token = that.model.get('token'),
        pusher,
        channel;
    if (token) {
      return;
    }
    pusher = new Pusher(that._PUSHER_API_KEY);
    channel = pusher.subscribe("casto-" + that.model.get('unique'));
    channel.bind('code-casting', function(code) {
      that.handleLoadReader(code.body);
    });
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

  initialize: function() {
    console.log("--- initialize");
    //console.log(this.model);
  },

  preRender: function() {
    console.log("--- preRender");
    console.log(this.model);
  },

  /*
   * Environment: client.
   */
  postRender: function() {
    console.log("--- postRender");
    console.log(this.model);

    var unique = this.model.get('unique');
    var token = localStorage.getItem('token_' + unique);
    this.model.set('token', token);

    var that = this,
        $editor = $('#editor');

    // drag & drop のイベントを追加
    $.event.props.push("dataTransfer");

    that.setPusher();
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
