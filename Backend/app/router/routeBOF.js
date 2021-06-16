const express = require("express");
const router = express.Router();
const BOFController = require("./controllers/BOFController");

//Routers
router.get("/", BOFController.view);
router.get("/:formName", BOFController.viewForm);
router.post("/:formName", BOFController.submitForm);

router.get('/succes', BOFController.submit);

module.exports = router;
