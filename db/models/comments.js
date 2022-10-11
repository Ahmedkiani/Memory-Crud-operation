const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const User = require("./users");
const Memories = require("./memories");

const commentMemorySchema = new mongoose.Schema(
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
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comments", commentMemorySchema);
