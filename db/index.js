const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db/db.json");
const database = low(adapter);

const db = {
  ref: (table) => {
    const config = {};
    config[table] = [];
    database.defaults(config).write();
    const data = database.get(table);
    return {
      post: (prop) => {
        prop.status = true;
        prop.editable = true;
        prop.date = Date.now();
        prop.update = Date.now();
        return data.push(prop).write();
      },
      delete: (prop) => {
        return data.remove(prop).write();
      },
      update: (prop) => {
        prop.update = Date.now();
        return data.find({ id: prop.id }).assign(prop).write();
      },
      find: (prop) => {
        return data.find(prop).value();
      },
      get: (sort) => {
        if (sort === undefined) sort = "id";
        return data.filter({ status: true }).sortBy(sort).value();
      },
      length: () => {
        return data.size().value();
      },
      map: (key) => {
        return data.map(key).value();
      },
      filter: (prop, sort) => {
        return data.filter(prop).sortBy(sort).take(5).value();
      },
      lastUpdate: () => {
        console.log(data.value()[data.size().value() - 1].update);
        return data.value()[data.size().value() - 1].update;
      },
    };
  },
};

module.exports = db;
