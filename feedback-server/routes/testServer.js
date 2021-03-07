var express = require("express");
const app = require("../app");
var router = express.Router();

const defaultData = [[5,4,6,2,5],[1.3,2.1,2.9,3.8,5],[4,3,2,1,5],[3.8,2.9,2.1,1.3,5],[1,2,3,4,5],[3.8,2.9,2.1,1.3,5]];
router.get("/", function(req, res, next) {
    res.send("API is working properly");
});

router.get('/rnummer', (req, res) => {
    res.json({personal: defaultData, average: defaultData});
});

module.exports = router;