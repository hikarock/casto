module.exports = function(match) {

  match('',          'home#index');
  match('a',         'editor#index');
  match('a/',        'editor#index');
  match('a/:unique', 'editor#index');

};
