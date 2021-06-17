const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
  console.log("User authentication started");
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log(token);

  if (token) {
    jwt.verify(token, config.auth.secret, function (err, decoded) {
      if (err) {
        return res.status(401).send({
          success: false, 
          error: "Unauthorized"
        })
      } else {
        return res.status(200).send({
          success: true,
          message: 'Authenticatie voltooid'
        })
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
  console.log("User authentication started");
  const token = (req.header("authorization") ?? "").replace("Bearer ", "");

  if (token) {
    jwt.verify(token, config.auth.secret, {}, function (err, decoded) {
      if (err) {
        return res.status(401).send({
          success: false, 
          error: "Log in om verder te gaan."
        })
      } else {
        if (res.isAdmin === 1) {
          return res.status(200).send({
            success: true,
            message: 'Authenticatie voltooid'
          })
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