const port = process.env.PORT || 3000;
const ip = process.env.IP || "127.0.0.1";
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const routes = require("./app/router/routes");
const logger = require("tracer").console();
const bodyParser = require("body-parser");
var serveStatic = require("serve-static");

const routeAdmin = require("./app/router/admin");
const routeLogin = require("./app/router/login");
const routeBOF = require("./app/router/routeBOF");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", routes);
//Templating Engine
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.use(express.static("public"));

app.set("view engine", "hbs");

app.use("/api", routes);
app.use("/admin", routeAdmin);
app.use("/login", routeLogin);
app.use("/beoordelingsformulier", routeBOF);
app.use(serveStatic("./views"));

app.listen(port, () => {
  logger.log(`Avans app listening at http://${ip}:${port}`);
});

module.exports = app;
