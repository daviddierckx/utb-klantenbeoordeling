const logger = require("tracer").console();

const methods = {

  placeholder: function(req, res) {
    logger.log("Sending placeholder request");
    return res
      .status(500)
      .send({ success: false })
  },

  enter_form_answer: function(req, res) {
    logger.log("Received request to add a form answers");
    return res
      .status(500)
      .send({ success: false, error: "not implemented yet" });
  },

  return_customer_feedback_html: function(req, res, next) {
    logger.log("Returning customer feedback main page");

    const formType = req.params.formType;
    const pageNr = req.params.pageNr;

    let toSend = "";

    switch (pageNr) {
      case "1":
        toSend = "klantenfeedback.html";
        break;
      case "2":
        toSend = "klantenfeedbacksterretjes.html";
        break;
      case "3":
        toSend = "klantendeedbackRadioButton.html";
        break;
      default:
        toSend = undefined;
        break;
    }
    try {
      res
        .status(200)
        .send("/Frontend/", toSend)
    } catch (err) {
      next({
        success: false,
        errCode: 400
      })
    }
  }
}

module.exports = methods;
