const express = require("express");
const router = express.Router();
const db = require("../db");
function permission(req, res, next) {
  if (req.session.users) {
    next();
  } else {
    res.redirect("/");
  }
}

router.get("/:id", permission, (req, res) => {
  const users = req.session.users;
  const id = req.params.id;
  const content = db.ref("pernikahan").find({ id });
  console.log(content);
  res.render("preview_pernikahan", {
    title: "Preview Pernikahan",
    users,
    script: "preview_pernikahan",
    content,
  });
});

module.exports = router;
