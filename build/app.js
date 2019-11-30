"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var index_1 = __importDefault(require("./src/index"));
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express_1.default();
app.use(logger("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express_1.default.static(path.join(__dirname, "public")));
app.use("/", index_1.default);
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
