const port = process.env.PORT || 3000;
const ip = process.env.IP || "127.0.0.1";
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const routes = require("./app/router/routes");
const logger = require("tracer").console();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const serveStatic = require("serve-static");

const routeAdmin = require("./app/router/admin");
const routeLogin = require("./app/router/login");
const routeBOF = require("./app/router/routeBOF");
const routeStatistics = require("./app/router/statisticsRoutes");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// middleware logger
app.use(function timeLog(req, res, next) {
  logger.log(req.originalUrl, "Time:", Date.now(), "data:", JSON.stringify(req.body), "query:", JSON.stringify(req.query), "params:", JSON.stringify(req.params));
  next();
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

app.get("/", (req, res) => { res.redirect("login"); });
app.use("/api", routes);
app.use("/admin", routeAdmin, routeStatistics);
app.use("/login", routeLogin);
app.use("/beoordelingsformulier", routeBOF);
app.use(serveStatic("./views"));

app.listen(port, () => {
  logger.log(`Avans app listening at http://${ip}:${port}`);
});

module.exports = app;
