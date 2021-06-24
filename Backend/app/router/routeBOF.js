const express = require("express");
const router = express.Router();
const BOFController = require("./controllers/BOFController");

//Routers
router.get("/", BOFController.selectForm);
router.get("/Gast", BOFController.guestLogin);
router.get("/:formName", BOFController.viewForm);
router.post("/:formName", BOFController.submitForm);
router.get("/:formName/:entryId", BOFController.viewSingle);

router.get('/succes', BOFController.submit);

module.exports = router;
