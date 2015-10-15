var express = require('express')
  , rendr = require('rendr')
  , compress = require('compression')
  , bodyParser = require('body-parser')
  , serveStatic = require('serve-static')
  , logger = require('morgan')
  , config = require('config')
  , app = express();

/**
 * Initialize Express middleware stack.
 */
app.use(compress());
app.use(serveStatic(__dirname + '/public'));
app.use(logger('combined'))
app.use(bodyParser.json());

/**
 * Initialize our Rendr server.
 */
var server = rendr.createServer({
  dataAdapterConfig: config.api,
  errorHandler: function (err, req, res){
    if (err.status == 404) {
      res.redirect('404');
    } else {
      console.error(err);
      res.redirect('503');
    }
  },
  notFoundHandler: function (req, res){
    res.redirect('404');
  }
});

/**
  * To mount Rendr, which owns its own Express instance for better encapsulation,
  * simply add `server` as a middleware onto your Express app.
  * This will add all of the routes defined in your `app/routes.js`.
  * If you want to mount your Rendr app onto a path, you can do something like:
  *
  *     app.use('/my_cool_app', server);
  */
server.configure(function (expressApp) {
  app.use('/', expressApp);
});

/**
 * Start the Express server.
 */
function start(){
  var port = process.env.PORT || 3030;
  app.listen(port);
  console.log('server pid %s listening on port %s in %s mode',
    process.pid,
    port,
    app.get('env')
  );
}


/**
 * Only start server if this script is executed, not if it's require()'d.
 * This makes it easier to run integration tests on ephemeral ports.
 */
if (require.main === module) {
  start();
}

exports.app = app;
