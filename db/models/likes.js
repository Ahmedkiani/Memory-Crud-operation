const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const User = require("./users");
const Memories = require("./memories");

const likeSchema = new mongoose.Schema(
  {
    memoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Memories,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: User,
      required: true,
    },
    flag: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("likes", likeSchema);
