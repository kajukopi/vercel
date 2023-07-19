const path = require("path");
const express = require("express");
const session = require("express-session");
const { sessionStore, sessionDB } = require("./session/");
const app = express();
const port = process.env.PORT || 80;

const hbs = require("./hbs");

hbs.registerPartials(path.join(__dirname, "/views"), {
  rename: function (name) {
    return name.replace(/\W/g, "_");
  },
});

app.use(
  session({
    secret: "123456789456123456789",
    resave: false,
    saveUninitialized: false,
    store: new sessionStore(sessionDB, {
      ttl: 86400,
    }),
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

app.use("/", require("./router/index"));
app.use("/api", require("./router/api"));
app.use("/signout", require("./router/signout"));
app.use("/pernikahan", require("./router/pernikahan"));

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
