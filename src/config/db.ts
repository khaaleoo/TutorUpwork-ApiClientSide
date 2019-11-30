var mongoose = require("mongoose");
var mongoDB =
  "mongodb+srv://lexuankha2409:123456kha@cluster0-bezjf.mongodb.net/TutorUpworkDB?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }, (e: Error): void => {
  if (e) console.error(e);
  else console.log("success");
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export default db;
