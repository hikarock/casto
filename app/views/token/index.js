var BaseView = require('../base'),
    _        = require('underscore');

module.exports = BaseView.extend({
  className: 'token_index_view',

  postRender: function() {
    console.log("--- preRender");
    console.log(this.model);
    var unique = this.model.get('unique');
    var token  = this.model.get('token');

    //TODO: localStrageはよろしくなさそうなので仮
    localStorage.setItem('token_' + unique , token);
    this.app.router.redirectTo('/a/' + unique);
  }
});

module.exports.id = 'token/index';
