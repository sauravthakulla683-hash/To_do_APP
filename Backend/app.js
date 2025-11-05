const express = require("express");
const app = express();
require("./conn/conn");

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(1000, (e) => {
  console.log(`server started at ${e}`);
});
