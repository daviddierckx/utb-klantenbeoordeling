const port = process.env.PORT || 3000;
const ip = process.env.IP || '127.0.0.1'
const express = require("express");
const app = express();
const routes = require("./Backend/app/router/routes");
const logger = require("tracer").console();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const routeAdmin = require("./Backend/app/router/admin");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", routes);
//Templating Engine
app.engine("hbs", exphbs({ extname: ".hbs" }));

app.get('/', function(req, res) {
  logger.log('Called GET on /')
  logger.log(__dirname + '/Frontend/index.html');
  res.sendFile(__dirname + '/Frontend/index.html');
})
app.set("view engine", "hbs");
app.use("/api", routes);
app.use("/admin", routeAdmin);
app.listen(port, () => {
  logger.log(`Avans app listening at http://${ip}:${port}`);
});

module.exports = app;
