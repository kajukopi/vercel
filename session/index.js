const session = require("express-session");
const sessionStore = require("lowdb-session-store")(session);
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// The default value must be an array.
const sessionAdapter = new FileSync("session/database.json", { defaultValue: [] });
const sessionDB = lowdb(sessionAdapter);

module.exports = { sessionStore, sessionDB };
