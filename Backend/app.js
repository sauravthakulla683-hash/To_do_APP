const express = require("express");
const app = express();
const auth = require("./routes/auth");
const list = require("./routes/list");
require("./conn/conn");
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/auth", auth);
app.use("/api/list", list);

app.listen(1000, (e) => {
  console.log(`server started at ${e}`);
});
