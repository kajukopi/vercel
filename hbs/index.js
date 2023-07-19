const hbs = require("hbs");

hbs.registerHelper("statuscontext", function (status) {
  if (status === undefined) status = "vw";
  switch (status) {
    case "su":
      return "Superuser";
    case "st":
      return "Staff";
    case "op":
      return "Operator";
    case "vw":
      return "Viewer";

    default:
      break;
  }
});

hbs.registerHelper("statusclasslist", function (status) {
  if (status === undefined) status = "vw";
  switch (status) {
    case "su":
      return "bg-primary";
    case "st":
      return "bg-secondary";
    case "op":
      return "bg-warning";
    case "vw":
      return "bg-success";

    default:
      break;
  }
});

module.exports = hbs;
