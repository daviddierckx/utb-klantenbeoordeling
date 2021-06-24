require('dotenv').config({path:__dirname+'/./.env'})

const port = process.env.PORT || 3000;
const ip = process.env.IP || "127.0.0.1";
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const routes = require("./app/router/routes");
const logger = require("tracer").console();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const serveStatic = require("serve-static");
const jwt = require("jsonwebtoken");
const config = require("./app/config");

const routeAdmin = require("./app/router/admin");
const routeLogin = require("./app/router/login");
const routeBOF = require("./app/router/routeBOF");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// middleware logger
app.use(function timeLog(req, res, next) {
  logger.log(req.originalUrl, 'Time:', Date.now(), 'data:', JSON.stringify(req.body), 'query:', JSON.stringify(req.query), 'params:', JSON.stringify(req.params))
  next();
});

// User Authentication
app.use(function timeLog(req, res, next) {
  if (
    req._parsedUrl.pathname === "/info" ||
    req._parsedUrl.pathname === "/register" ||
    req._parsedUrl.pathname === "/login" ||
    req._parsedUrl.pathname === "/" ||
    req._parsedUrl.pathname.startsWith("/css") ||
    req._parsedUrl.pathname.startsWith("/js") ||
    req._parsedUrl.pathname.startsWith("/images")
  ) {
    return next();
  }

  // If you want to skip out add this to your .env file: "SKIP_AUTH=1"
  if (process.env.SKIP_AUTH === 1) {
    logger.log("Skipping auth because of ENV SKIP_AUTH")
    return next();
  }

  // Check if auth cookie exists
  if (req.cookies === undefined || req.cookies['utb-auth'] === undefined) {
    return res.status(401).redirect("/");
  }

  logger.log("User authentication started");
  const token = req.cookies['utb-auth'];
  jwt.verify(token, config.auth.secret, {}, function (err, decoded) {
    if (err) {
      return res.status(401).redirect("/");
    }
    // If trying to access admin as user page deny access
    if (decoded.isAdmin === 0 && req._parsedUrl.pathname.startsWith("/admin")){
      return res.status(401).redirect("/");
    }
    req.user_email = decoded.user_email;
    req.user_id = decoded.user_id;
    req.isAdmin = decoded.isAdmin;
    logger.log("User authorization success:", JSON.stringify(decoded));
    next();
  });
});

app.use("/api", routes);
//Templating Engine
const hbs = exphbs.create({
  extname: ".hbs",
  helpers: require("./app/utils/handlebarsHelpers")
});
app.engine("hbs", hbs.engine);
app.use(express.static("public"));


app.set("view engine", "hbs");

app.get('/', (req, res) => { res.redirect("login") });
app.use("/api", routes);
app.use("/admin", routeAdmin);
app.use("/login", routeLogin);
app.use("/beoordelingsformulier", routeBOF);
app.use(serveStatic("./views"));

app.listen(port, ip, () => {
  logger.log(`Avans app listening at http://${ip}:${port}`);
});

module.exports = app;
