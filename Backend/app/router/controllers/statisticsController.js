const logger = require('tracer').console()
const statistics_dao = require('../../dao/statisticsDao')

module.exports = {
    getAverageRatings(req, res) {
        statistics_dao.getAveragesFromRating((err, res) => {
            if (err) {
                logger.log("Error getting average ratings:", err)
                return res.status(400).send({
                    success: false,
                    error: err
                })
            }
            // logger.log("Got average ratings", JSON.stringify(res))
            // return res.status(200).send({
            //     success: true,
            //     data: res
            // })

            // Maak lijst van vragen en gemiddeldes
            var list = document.createElement("div");
            list.className = "opmerkingenLijst";

            for (let i = 0; i < res.length; i++) {
                //maak 'opmerking box' div
                var box = document.createElement("div");
                box.className = "opmerkingenBox";
                //maak 'vraag ' p
                var vraag = document.createElement("p");
                vraag.className = "vraag";
                vraag.innerText = res.name;
                //maak 'gemiddelde' p
                var gemiddelde = document.createElement("p");
                gemiddelde.className = "gemiddelde";
                gemiddelde.innerText = res.remarks;

                // voeg vraag en gemiddelde toe aan box
                box.appendChild(vraag);
                box.appendChild(gemiddelde);

                // voeg toe aan lijst
                list.appendChild(box);

                // add to body
                var element = document.getElementsByClassName("overzicht")[0];
                element.appendChild(list);
            }
        })
    },

    getCountRadioButtonAnswers(req, res) {
        statistics_dao.getCountOfRadioButtons((err, res) => {
            if (err) {
                logger.log("Error getting count of ratings:", err)
                return res.status(400).send({
                    success: false,
                    error: err
                })
            }
        })
    },

    getRemarks(req, res) {
        statistics_dao.getRemarks((err, res) => {
            if (err) {
                logger.log("Error getting remarks:", err)
                return res.status(400).send({
                    success: false,
                    error: err
                })
            }
            var list = document.createElement("div");
            list.className = "opmerkingenLijst";

            for (let i = 0; i < res.length; i++) {
                //maak 'opmerking box' div
                var box = document.createElement("div");
                box.className = "opmerkingenBox";
                //maak 'naam bedrijf' p
                var naam = document.createElement("p");
                naam.className = "naamBedrijf";
                naam.innerText = res.name;
                //maak 'opmerking' p
                var opmerking = document.createElement("p");
                opmerking.className = "opmerking";
                opmerking.innerText = res.remarks;

                // voeg naam en opmerking to aan box
                box.appendChild(naam);
                box.appendChild(opmerking);

                // voeg toe aan lijst
                list.appendChild(box);

                // add to body
                var element = document.getElementsByClassName("overzicht")[0];
                element.appendChild(list);
            }
        })
    }
}
