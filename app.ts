import express from "express";
import index from "./src/index";
import db from "./src/config/db"
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
import Controllers from "./src"
//--------------------------------------------------------------------
db.on("error", console.error.bind(console, "MongoDB connection error:"));
//---------------------------------------------------------------------


var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//---------------------------------------------------------------------
app.use("/", Controllers)
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

