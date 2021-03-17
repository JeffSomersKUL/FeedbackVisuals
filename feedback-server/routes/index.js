var express = require("express");
const app = require("../app");
var router = express.Router();

var fs = require("fs");
var csv = require("jquery-csv");

// ADD THE NAME OF YOUR CSV-FILE HERE


const csvfiles = ["test","test","test","test","test","test"];


//****************  DONT TOUCH THE LINES BELOW THIS COMMENT  ****************//

router.get('/rnummer', (req, res) => {
    console.log(req.query.rnummer);
    let data =update(req.query.rnummer)
    console.log(data);
    res.json(data);
});

function update(rnummer) {
    var returndata = [];
    var averagedata = [];
    for (filename in csvfiles) {

        const data = fs.readFileSync('oefenzittingen/'+csvfiles[filename]+'.csv', {encoding:'utf8'});
        const parsedData = csv.toObjects(data);

        const found = false;
        for (i in parsedData){
            row = parsedData[i];
            if (row.Rnummer == rnummer) {
                found = true
                returndata.push([row.plan, row.concepten, row.wiskundig, row.rekentechnisch, row.interpretatie]);
                
            }
        }
        let avgRow = parsedData[parsedData.length -1];
        averagedata.push([avgRow.plan, avgRow.concepten, avgRow.wiskundig, avgRow.rekentechnisch, avgRow.interpretatie]);
        if (found == false){
            returndata.push([0.0, 0.0, 0.0, 0.0, 0.0]);
        }

    }

    return {personal: returndata, average: averagedata};
}

module.exports = router;