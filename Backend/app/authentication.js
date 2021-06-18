const jwt = require('jsonwebtoken');
const config = require('./config');

exports.isLoggedIn = (req, res, next) => {
  console.log("Authenticatie gestart.");
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, config.auth.secret, function (err, decoded) {
      if (err) {
        return res.status(401).send({
          success: false, 
          error: "Log in om verder te gaan."
        })
      } else {
        next();
      }
    });
  } else {
    return res.status(401).send({
      success: false,
      message: 'Log in om verder te gaan.'
    });
  }
}

exports.isAdminLoggedIn = (req, res, next) => {
  console.log("Authenticatie gestart.");
  const token = req.cookies.token;
  const isAdmin = req.cookies.isAdmin;

  if (token) {
    jwt.verify(token, config.auth.secret, {}, function (err, decoded) {
      if (err) {
        return res.status(401).send({
          success: false, 
          error: "Log in om verder te gaan."
        })
      } else {
        if (isAdmin === '1') {
          next();
        } else {
          return res.status(401).send({
            success: false,
            error: "Alleen administrators hebben toegang tot deze pagina."
          })
        }
      }
    });
  } else {
    return res.status(401).send({
      success: false,
      error: 'Log in om verder te gaan.'
    });
  }
}