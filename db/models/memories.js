const { ObjectId, Mongoose } = require("mongoose");
const mongoose = require("mongoose");
const User = require("./users");

const memoriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
    },
    image: {
      type: Array,
    },
    memory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Memory",
    },
    userId: {
      type: ObjectId,
      ref: User,
      required: true,
    },
    sharedFrom: {
      type: ObjectId,
      ref: "Memory",
      required: false,
    },
  },
  {
    strict: false,
  }
);

module.exports = mongoose.model("memories", memoriesSchema);
