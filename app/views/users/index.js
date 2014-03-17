var BaseView = require('../base');

module.exports = BaseView.extend({
  className: 'users_index_view',
  postRender: function(foo) {
    console.log("users postRender");
    console.log(this.options);
    console.log(this.model);
    console.log(foo);
  },

});
module.exports.id = 'users/index';
