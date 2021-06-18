const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const BOFController = require("./controllers/BOFController");
const logger = require("tracer").console();
const authentication = require("../authentication");

//Routers
router.get("/", authentication.isLoggedIn, BOFController.view);
router.get("/:formName", authentication.isLoggedIn, BOFController.viewForm);
router.post("/:formName", authentication.isLoggedIn, BOFController.submitForm);
router.get("/:formName/:entryId", authentication.isAdminLoggedIn, BOFController.viewSingle);

router.get('/succes', authentication.isLoggedIn, BOFController.submit);

module.exports = router;
