async function home(req, res) {
  res.render('customer/page/home');
}

async function dashboard(req, res) {
  res.render('customer/page/home');
}

module.exports = {
    home: home,
    dashboard: dashboard
}