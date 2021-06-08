const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const BOFController = require("./controllers/BOFController");
const logger = require("tracer").console();

//Routers
router.get("/", BOFController.view);

module.exports = router;
