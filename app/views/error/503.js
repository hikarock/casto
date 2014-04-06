var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'error_503_view',
  setEditor: function() {
    var theme = 'ace/theme/tomorrow_night_eighties',
        mode  = 'ace/mode/javascript',
        editor;

    editor = ace.edit('editor');
    editor.setReadOnly(true);
    editor.setPrintMarginColumn(false);
    editor.setTheme(theme);
    editor.setSelectionStyle('line');
    editor.getSession().setMode(mode);
  },
  postRender: function() {
    this.setEditor();
  }
});
module.exports.id = 'error/503';
