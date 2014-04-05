module.exports = function(match) {
  match('',          'home#index');
  match('a',         'token#index');
  match('a/:unique', 'code#index');
  match('/404',      'error#404');
  match('/503',      'error#503');
  match('*',         'error#404');
};
