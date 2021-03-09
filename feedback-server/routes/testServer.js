var express = require("express");
const app = require("../app");
var router = express.Router();

var fs = require("fs");
var csv = require("jquery-csv");

// ADD THE NAME OF YOUR CSV-FILE HERE
const csvfiles = ["1","test","1","1","1","1"];

// DONT TOUCH THIS CODE
const defaultPersonalData = [[1.0,0.2857142857142857,0.6928571428571428,0.5357142857142857,0.4],
                    [1.0,0.5714285714285714,0.7952380952380952,1.0,0.8],
                    [0.8333333333333334,0.5714285714285714,0.7785714285714286,0.5446428571428572,0.2],
                    [1.0,0.5714285714285714,0.85,0.9285714285714286,0.2],
                    [1.0,1.0,0.7238095238095238,1.0,0.6],
                    [0.8333333333333334,0.7142857142857143,0.8666666666666667,1.0,0.4]];

const defaultAverageData = [[1.0,0.5714285714285714,0.8666666666666667,1.0,0.8],
                    [0.8333333333333334,0.5714285714285714,0.6880952380952381,0.8571428571428572,0.2],
                    [1.0,0.5714285714285714,0.8666666666666667,1.0,0.4],
                    [1.0,0.8571428571428571,0.8666666666666667,1.0,0.0],
                    [0.8333333333333334,0.5714285714285714,0.8785714285714286,0.9375,0.0],
                    [0.8333333333333334,0.5714285714285714,0.95,1.0,0.2]];


router.get("/", function(req, res, next) {
    res.send("API is working properly");
});

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
        
        for (i in parsedData){
            row = parsedData[i];
            if (row.Rnummer == rnummer) {
                returndata.push([row.plan, row.concepten, row.wiskundig, row.rekentechnisch, row.interpretatie]);
                let avgRow = parsedData[parsedData.length -1];
                averagedata.push([avgRow.plan, avgRow.concepten, avgRow.wiskundig, avgRow.rekentechnisch, avgRow.interpretatie]);
            }
        }

    }

    return {personal: returndata, average: averagedata};
}

module.exports = router;