function addCsrfToken(req, res, next){
    res.locals.csrfToken = req.csrfToken();
    // console.log("Token in res.locals:", res.locals.csrfToken);
    next();
}

module.exports = addCsrfToken;