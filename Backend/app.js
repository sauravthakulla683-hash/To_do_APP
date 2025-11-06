const express = require("express");
const app = express();
const auth = require("./routes/auth");
require("./conn/conn");
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1", auth);

app.listen(1000, (e) => {
  console.log(`server started at ${e}`);
});
