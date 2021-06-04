const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const routes = require("./app/router/routes");
const logger = require("tracer").console();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const routeAdmin = require("./app/router/admin");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", routes);
//Templating Engine
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.use(express.static("public"));

app.set("view engine", "hbs");
app.use("/api", routes);
app.use("/admin", routeAdmin);

app.listen(port, () => {
  logger.log(`Avans app listening at http://localhost:${port}`);
});

module.exports = app;
