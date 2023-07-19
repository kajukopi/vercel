const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use("*", (req, res) => {
  res.send(200);
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
