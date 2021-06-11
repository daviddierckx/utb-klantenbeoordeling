// Controller voor gemiddelde overzicht en opmerkingen


const mysql = require("mysql");
const database = require("../../dao/database");
const logger = require("tracer").console();

// NOG AF TE MAKEN!!!
// haalt een lijst van opmerkingen op uit de database
function remarks() {
  // User the connection
  database.con.query("SELECT * FROM Question JOIN Answer ON Answer.questionId = Question.id WHERE questionType = 'remarks'", (err, rows) => {
    if (!err) {
      res.render("home", { rows });
    } else {
      logger.log(err);
    }
    logger.log("Remarks received from database: " + rows);
    // Nog te implementer:
    // check ROWS en welke COLUMN name
    // maak main div
    var list =document.createElement("div");
        list.className = "opmerkingenLijst";

    for (let i = 0; i < rows.length; i++) { 
      console.log(colors[i]);
      //maak 'opmerking box' div
      var box = document.createElement("div");
        box.className = "aClassName";
      //maak 'naam bedrijf' p
      var naam = document.createElement("p");
        naam.className = "naamBedrijf";
        naam.innerText = rows.name;
      //maak 'opmerking' p
      var opmerking =document.createElement("p");
        opmerking.className = "opmerking";
        opmerking.innerText = rows.remarks;

      // voeg naam en opmerking to aan box
      box.appendChild(naam);
      box.appendChild(opmerking);

      // voeg toe aan lijst
      list.appendChild(box);

    }
  });
};

