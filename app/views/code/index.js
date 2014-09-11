var BaseView = require('../base'),
    _        = require('underscore');

module.exports = BaseView.extend({
  className: 'code_index_view',

  _PUSHER_API_KEY: 'd3adbb2d6866384d7152',
  _NEW_FILE_URI: '/a',
  _FILE_MONITORING_INTERVAL: 250,

  // 読込中のファイルの最終更新日時
  lastMod: '',
  _code: '',

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
    $('#editor, .disconnected').removeClass('over');
  },

  handleDragover: function(evt) {
    $('#editor, .disconnected').addClass('over');
  },

  offDrop: function() {
    var that    = this,
        $body   = $('body'),
        $editor = $('#editor'),
        $file   = $('#file');

    $body.off('drop')
         .off('dblclick')
         .off('dragleave')
         .off('dragover');
    $('#editor, .disconnected').removeClass('over');

    $file.attr('disabled', true);
    $('#filename i').removeClass('fa-unlink').addClass('fa-link');
    clearInterval(that.intervalId);
    $body.on('drop', function(evt) {
      evt.preventDefault();
      alert('Is already connected with the file.');
    }).on('dragleave', function(evt) {
      evt.preventDefault();
    }).on('dragover', function(evt) {
      evt.preventDefault();
    });
  },

  handleDrop: function(file) {
    var that = this,
        mode,
        init = true;

    if (!that.isValidFileType(file.type)) {
      console.log(file.type);
      alert('Only text file.');
      return;
    }

    that.offDrop();
    $('.disconnected').hide();
    $('.connected').show(0, function() {
      setTimeout(function() {
        $('.connected').fadeOut();
      }, 5000);
    });

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
      that.save(that.reader.result, init);
      history.pushState('', document.title, location.pathname);
      init = false;
    };

    that.reader.readAsText(file);
  },

  save: function(code, init) {
    var that = this;

    that.editor.setValue(code);
    that.editor.clearSelection();

    if (!that.diffHighlight(code) && !init) {
      return;
    }

    that.model.set('body', code);

    if (that.isOwner()) {
      this.model.save();
    }
  },

  /*
   * 変更箇所をハイライトする
   */
  diffHighlight: function(code) {
    var that = this, diff, volume, value, i, max, d, pos,
        removedFlg = false;

    diff = JsDiff.diffLines(that._code, code);
    that._code = code;

    if (diff.length === 1) {
      if (that.isFirefox) {
        that.editor.find(that._lastDiffLine);
      }
      return false;
    }

    volume = localStorage.getItem('setting_volume');

    for (i = 0, max = diff.length; i < max; i++) {
      d = diff[i];
      if (d.added) {
        that._lastDiffLine = d.value;
        that.editor.find(d.value);
        if (volume === '1') {
          added.play();
          break;
        }
      }
      if (d.removed) {
        removedFlg = true;
        if (volume === '1') {
          removed.play();
          break;
        }
      }
    }
    if (removedFlg && i + 1 < d.length) {
      d = diff[i + 1];
      value = d.value.split(/\r|\r\n|\n/)[0];
      that._lastDiffLine = value;
      that.editor.find(value);
    }

    pos = that.editor.getCursorPosition();
    location.hash = '#L' + pos.row;

    return true;
  },

  setEditor: function() {
    var that  = this,
        theme = 'ace/theme/tomorrow_night_eighties',
        mode  = 'ace/mode/javascript',
        lineNumber = that.getLineNumber();

    if (this.model.get('filename')) {
        mode = modelist.getModeForPath(this.model.get('filename')).mode;
    }

    that.editor = ace.edit('editor');
    that.editor.setReadOnly(true);
    that.editor.setPrintMarginColumn(false);
    that.editor.setTheme(theme);
    that.editor.setSelectionStyle('line');

    that.editor.getSession().on('changeMode', function() {
      if (lineNumber) {
        that.editor.gotoLine(lineNumber, 0, true);
      }
    });

    that.editor.getSession().setMode(mode);

    that.editor.on('click', function() {
      var pos = that.editor.getCursorPosition();
      location.hash = '#L' + (pos.row + 1);
    });
  },

  getLineNumber: function() {
    var hash = location.hash, num;
    if (hash.match(/^#L[0-9]*$/i)) {
      num = hash.replace(/^#L/i, '');
      return num;
    }
    return false;
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
      that.save(code.body);
    });
  },

  setSound: function() {
    var that = this,
        $volume = $('#volume');
    $volume.on('click', function(evt) {
      evt.preventDefault();
      var volume = localStorage.getItem('setting_volume');
      if (volume === '1') {
        that.setMute();
      } else {
        that.setUnMute();
      }
    });

    var volume = localStorage.getItem('setting_volume');
    if (volume === null) {
      that.setUnMute();
    } else {
      if (volume === '0') {
        that.setMute();
      } else {
        that.setUnMute();
      }
    }
  },

  setMute: function() {
    var $volume = $('#volume');
    $volume.find('i').addClass('fa-volume-off').removeClass('fa-volume-up');
    $volume.find('span').text('Un Mute');
    localStorage.setItem('setting_volume', '0');
  },

  setUnMute: function() {
    var $volume = $('#volume');
    $volume.find('i').addClass('fa-volume-up').removeClass('fa-volume-off');
    $volume.find('span').text('Mute');
    localStorage.setItem('setting_volume', '1');
  },

  // see also: http://stackoverflow.com/a/14284215
  tick: function(file) {
    var that = this;
    if (!file) {
      return;
    }
    if (that.isFirefox()) {
      // Firefoxだと更新日時が変わらないため常にファイルを読み込む
      that.reader.readAsText(file);
    } else if (file.lastModifiedDate.getTime() != that.lastMod.getTime()) {
      that.lastMod = file.lastModifiedDate;
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
   * Firefoxか？
   */
  isFirefox: function() {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
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
    if (this.model.get('body')) {
      var code = this.model.get('body');
      code = code.replace(/<\//g, '<\\/');
      this.model.set('body', code);
    }
  },

  /*
   * Environment: client.
   */
  postRender: function() {
    console.log("--- postRender");

    var unique  = this.model.get('unique'),
        token   = localStorage.getItem('token_' + unique),
        that    = this,
        $body   = $('body'),
        $editor = $('#editor');

    this.model.set('token', token);
    that._code = this.model.get('body');

    that.setPusher();
    that.setEditor();
    that.setSound();

    $('#new').on('click', function(evt) {
      evt.preventDefault();
      window.open(that._NEW_FILE_URI);
    });

    if (!that.isOwner()) {
      $('#filename i').removeClass('fa-unlink').addClass('fa-cloud-download');
      $body.on('drop', function(evt) {
        evt.preventDefault();
        alert('You do not have permission.');
      }).on('dragleave', function(evt) {
        evt.preventDefault();
      }).on('dragover', function(evt) {
        evt.preventDefault();
      });
      return;
    }

    if (that.model.get('body')) {
      $('.disconnected').show();
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

    $body.on('drop', function(evt) {
      evt.preventDefault();
      var file = evt.dataTransfer.files[0];
      that.handleDrop(file);
    });

    $body.on('dragleave', function(evt) {
      evt.preventDefault();
      that.handleDragleave(evt);
    });

    $body.on('dragover', function(evt) {
      evt.preventDefault();
      that.handleDragover(evt);
    });
  }
});

module.exports.id = 'code/index';
