const express = require("express");
const router = express.Router();

function permission(req, res, next) {
  if (req.session.users) {
    next();
  } else {
    res.redirect("/");
  }
}

router.get("/", permission, (req, res) => {
  const users = req.session.users;
  res.render("pernikahan", { title: "Form Pernikahan", users, script: "pernikahan" });
});


module.exports = router;
