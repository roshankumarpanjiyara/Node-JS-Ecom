function handleErrors(err, req, res, next){
    console.log(err);
    res.status(500).render('customer/error/page-500');
}

module.exports = handleErrors;