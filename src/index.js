var express = require("express");
var router = express.Router();
require("dsfg");
/* GET home page. */
router.get("/", function(req, res) {
  console.log("Listening on port 8000");
  res.send("ApiClientSide");
});

module.exports = router;
