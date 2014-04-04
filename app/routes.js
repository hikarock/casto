module.exports = function(match) {
  match('',          'home#index');
  match('a',         'token#index');
  match('a/:unique', 'code#index');
  match('*',         'error#404');
};
