const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const BOFController = require("./controllers/BOFController");
const logger = require("tracer").console();

//Routers
router.get("/", BOFController.view);
router.get("/:formName", BOFController.viewForm);
router.post("/:formName", BOFController.submitForm);
router.get("/:formName/:entryId", BOFController.viewSingle);

router.get('/succes', BOFController.submit);

module.exports = router;
