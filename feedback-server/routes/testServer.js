var express = require("express");
const app = require("../app");
var router = express.Router();

var fs = require("fs");
//var csv = require("jquery-csv");
const csv = require('csv-parser');



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
    update();
    res.json({personal: defaultPersonalData, average: defaultAverageData});
});


const update = () => {
    console.log("test");
    //var data = csv.toObjects("../../../../data-fetching/output/1.csv");

    // var file = fs.readFile("oefenzittingen/1.csv", (err, data) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log(file);
    //     var data = csv.toObjects(file);
    //     console.log(data[0]);
    // });

    fs.createReadStream('oefenzittingen/1.csv')
    .pipe(csv())
    .on('data', (row) => {
        if (row.Rnummer == 'R_3CWsYWSQlK41wli')
            console.log(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
}

module.exports = router;