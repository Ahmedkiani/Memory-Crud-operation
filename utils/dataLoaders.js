const DataLoader = require("dataloader");
const { Collection } = require("mongoose");
const { Users } = require("../db/dbConnector");
let load = {};
async function batchFunction(keys, collection) {
  const results = await collection.find({ _id: keys });
  if (results.length) {
    const values = keys.map((key) =>
      results.find((doc) => doc._id.toString() == key.toString())
    );
    return values;
  } else {
    return null;
  }
  // return keys.map(key => results[key] || new Error(`No result for ${key}`))
}

const loader = (_keys, collection, val) => {
  if (!load[val]) {
    load[val] = new DataLoader((keys) => batchFunction(keys, collection));
    return load[val].load(_keys);
  } else {
    return load[val].load(_keys);
  }
};

module.exports = {
  loader,
};
