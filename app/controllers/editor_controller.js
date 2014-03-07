module.exports = {

  index: function(params, callback) {

    console.log("editor/index controller.");

    if ('unique' in params) {
      var spec = {
        code: {
          model: 'Code',
          params: params
        }
      };
      this.app.fetch(spec, function(err, result) {
        callback(err, result);
      });
    } else {
      console.log("tokenとりたい");
      callback();
    }
  }
};
