const logger = require("tracer").console();
const statistics_dao = require("../../dao/statisticsDao");

module.exports = {
  getAverageRatings(req, res) {
    statistics_dao.getAveragesFromRating((err, results) => {
      if (err) {
        logger.log("Error getting average ratings:", err);
        return res.status(400).send({
          success: false,
          error: err,
        });
      }
      // logger.log("Got average ratings", JSON.stringify(res))
      // return res.status(200).send({
      //     success: true,
      //     data: res
      // })

      // Maak lijst van vragen en gemiddeldes
      var list = document.createElement("div");
      list.className = "opmerkingenLijst";

      for (let i = 0; i < results.length; i++) {
        //maak 'opmerking box' div
        var box = document.createElement("div");
        box.className = "opmerkingenBox";
        //maak 'vraag ' p
        var vraag = document.createElement("p");
        vraag.className = "vraag";
        vraag.innerText = results.name;
        //maak 'gemiddelde' p
        var gemiddelde = document.createElement("p");
        gemiddelde.className = "gemiddelde";
        gemiddelde.innerText = results.remarks;

        // voeg vraag en gemiddelde toe aan box
        box.appendChild(vraag);
        box.appendChild(gemiddelde);

        // voeg toe aan lijst
        list.appendChild(box);

        // add to body
        var element = document.getElementsByClassName("overzicht")[0];
        element.appendChild(list);
      }
    });
  },

  getCountRadioButtonAnswers(req, res) {
    statistics_dao.getCountOfRadioButtons((err, results) => {
      if (err) {
        logger.log("Error getting count of ratings:", err);
        return res.status(400).send({
          success: false,
          error: err,
        });
      }
      // logger.log("Got the count!", JSON.stringify(results));
      // return res.status(200).send({
      //     success: true,
      //     data: results,

      // });// Maak lijst van vragen en gemiddeldes
      var list = document.createElement("div");
      list.className = "opmerkingenLijst";

      for (let i = 0; i < results.length; i++) {
        //maak 'opmerking box' div
        var box = document.createElement("div");
        box.className = "opmerkingenBox";
        //maak 'vraag ' p
        var vraag = document.createElement("p");
        vraag.className = "vraag";
        vraag.innerText = results.name;
        //maak 'gemiddelde' p
        var positief = document.createElement("p");
        positief.className = "gemiddelde";
        positief.innerText = "Positief:", results.AantalPositief;
        var neutraal = document.createElement("p");
        neutraal.className = "gemiddelde";
        neutraal.innerText = "Neutraal:", results.AantalNeutraal;
        var negatief = document.createElement("p");
        negatief.className = "gemiddelde";
        negatief.innerText = "Negatief:", results.AantalNegatief;

        // voeg vraag en gemiddelde toe aan box
        box.appendChild(vraag);
        box.appendChild(positief);
        box.appendChild(neutraal);
        box.appendChild(negatief);

        // voeg toe aan lijst
        list.appendChild(box);

        // add to body
        var element = document.getElementsByClassName("overzicht")[0];
        element.appendChild(list);
      }
    });
  },
};
