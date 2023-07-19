const express = require("express");
const router = express.Router();

function permission(req, res, next) {
  if (req.session.users) {
    next();
  } else {
    res.render("index", { title: "Home" });
  }
}

router.get("/", permission, (req, res) => {
  const users = req.session.users;
  res.render("index", { title: "Home", users });
});

module.exports = router;
