async function home(req, res) {
  res.render('customer/page/home');
}

async function dashboard(req, res) {
  res.render('customer/page/home');
}

function get404(req, res){
  res.render('common/error/page404');
}

function get401(req, res){
  res.render('common/error/page401');
}

function get403(req, res){
  res.render('common/error/page403');
}

function get500(req, res){
  res.render('common/error/page500');
}

module.exports = {
    home: home,
    dashboard: dashboard,
    get401: get401,
    get403: get403,
    get404: get404,
    get500: get500
}