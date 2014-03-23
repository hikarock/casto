var BaseView = require('../base'),
    _        = require('underscore');

module.exports = BaseView.extend({
  className: 'code_index_view',

  _PUSHER_API_KEY: 'd3adbb2d6866384d7152',
  _NEW_FILE_URI: '/a',
  _FILE_MONITORING_INTERVAL: 250,

  // 読込中のファイルの最終更新日時
  lastMod: '',

  /*
   * 読み込み許可するファイルタイプか？
   */
  isValidFileType: function(fileType) {
    var validFileTypes = [
      '',                         // .less や .conf が空文字になるため
      'application/x-javascript', // for Firefox
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

  offDrop: function() {
    var that = this,
        $editor = $('#editor'),
        $file = $('#file');
    $editor.off('drop')
           .off('dblclick')
           .off('dragleave')
           .off('dragover')
           .removeClass('over');
    $file.attr('disabled', true);
    $('#filename i').addClass('fa-spin');
    clearInterval(that.intervalId);
    $editor.on('drop', function(evt) {
      evt.preventDefault();
      alert('Is already connected with the file.');
    });
    $editor.on('dragleave', function(evt) {
      evt.preventDefault();
    });
    $editor.on('dragover', function(evt) {
      evt.preventDefault();
    });
  },

  handleDrop: function(file) {
    var that = this,
        mode;

    that.offDrop();

    if (!that.isValidFileType(file.type)) {
      console.log(file.type);
      alert('Only text file.');
      return;
    }

    mode = modelist.getModeForPath(file.name).mode;
    that.editor.getSession().setMode(mode);

    that.reader = new FileReader();
    that.model.set('filename', file.name);
    $('#filename span').text(file.name);

    that.lastMod = file.lastModifiedDate;

    that.intervalId = setInterval(function() {
      that.tick(file);
    }, that._FILE_MONITORING_INTERVAL);

    that.reader.onload = function(evt) {
      console.log("reader.onload");
      that.handleLoadReader();
    };

    that.reader.readAsText(file);
  },

  handleLoadReader: function(code) {
    console.log("handleLoadReader");

    var that = this, body, diff;

    if (arguments.length === that.handleLoadReader.length) {
      body = code;
    } else {
      body = that.reader.result;
    }

    diff = JsDiff.diffLines(that._body, body);
    console.log(diff);

    that._body = body;
    that.editor.setValue(body);
    that.editor.clearSelection();

    _.each(diff, function(d) {
      if (d.added) {
        that.editor.find(d.value);
      }
    });

    //TODO: diffがなかったらsaveしない/音を鳴らさない

    var volume = localStorage.getItem('setting_volume');
    if (volume) {
      type.play();
    }

    that.model.set('body', body);
    if (that.isOwner()) {
      console.log("save");
      this.model.save();
    }
  },

  setEditor: function() {
    var that  = this,
        theme = 'ace/theme/tomorrow_night_eighties';
        mode  = 'ace/mode/javascript';

    if (this.model.get('filename')) {
        mode = modelist.getModeForPath(this.model.get('filename')).mode;
    }

    that.editor = ace.edit('editor');
    that.editor.setReadOnly(true);
    that.editor.setPrintMarginColumn(false);
    that.editor.setTheme(theme);
    that.editor.setSelectionStyle('line');
    that.editor.getSession().setMode(mode);
  },

  setPusher: function() {
    var that = this,
        pusher,
        channel;
    if (that.isOwner()) {
      return;
    }
    pusher = new Pusher(that._PUSHER_API_KEY);
    channel = pusher.subscribe("casto-" + that.model.get('unique'));
    channel.bind('code-casting', function(code) {
      console.log("code-casting");
      console.log(code);
      that.handleLoadReader(code.body);
    });
  },

  setSound: function() {
    localStorage.removeItem('setting_volume');
    $('#volume').on('click', function(evt) {
      evt.preventDefault();
      if ($(this).find('i').hasClass('fa-volume-up')) {
        $(this).find('i')
        .addClass('fa-volume-off')
        .removeClass('fa-volume-up');
        $(this).find('span').text('Un Mute');
        localStorage.removeItem('setting_volume');
      } else {
        $(this).find('i')
        .addClass('fa-volume-up')
        .removeClass('fa-volume-off');
        $(this).find('span').text('Mute');
        localStorage.setItem('setting_volume', 1);
      }
    });
  },

  tick: function(file) {
    var that = this;
    if (file && file.lastModifiedDate.getTime() != that.lastMod.getTime()) {
      that.lastMod = file.lastModifiedDate;
      console.log('tick');
      that.handleLoadReader();
      that.reader.readAsText(file);
    }
  },

  isOwner: function() {
    var unique = this.model.get('unique'),
        token  = localStorage.getItem('token_' + unique);
    if (token) {
      return true;
    }
    return false;
  },

  /*
   * Environment: shared.
   */
  initialize: function() {
    console.log("--- initialize");
  },

  /*
   * Environment: shared.
   */
  preRender: function() {
    console.log("--- preRender");
  },

  /*
   * Environment: client.
   */
  postRender: function() {
    console.log("--- postRender");

    var unique = this.model.get('unique');
    var token = localStorage.getItem('token_' + unique);
    this.model.set('token', token);

    var that = this,
        $editor = $('#editor');

    that.setPusher();
    that.setEditor();
    that.setSound();

    $('#new').on('click', function(evt) {
      evt.preventDefault();
      window.open(that._NEW_FILE_URI);
    });

    if (!that.isOwner()) {
      return;
    }

    $editor.on('dblclick', function(evt) {
      evt.preventDefault();
      $('#file').click();
    });

    $('#file').on('change', function(evt) {
      var file = evt.target.files[0];
      that.handleDrop(file);
    });

    // drag & drop のイベントを追加
    $.event.props.push("dataTransfer");

    $editor.on('drop', function(evt) {
      evt.preventDefault();
      var file = evt.dataTransfer.files[0];
      that.handleDrop(file);
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
