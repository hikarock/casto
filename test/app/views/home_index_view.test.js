var HomeIndexView = require('../../../app/views/home/index')
  , App = require('../../../app/app')
;

describe('HomeIndexView', function() {

  beforeEach(function() {
    this.app = new App({rootPath: '/'});
  });

  it('should have words in getTemplateData', function() {
    var view = new HomeIndexView({app:this.app});
    var data = view.getTemplateData();
    data.should.have.exist;
  });

});
