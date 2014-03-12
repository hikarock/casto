var _ = require('underscore');

module.exports = {
  index: function(params, callback) {

    var spec = {
      model: {model: 'Code', params: {unique: params.unique}}
    };
    this.app.fetch(spec, function(err, result) {
      callback(err, result);
    });
  }
};
