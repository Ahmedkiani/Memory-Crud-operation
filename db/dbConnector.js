require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { userSchema } = require("./models/users");
const { memoriesSchema } = require("./models/memories");
const { commentsSchema } = require("./models/comments");
const { likesSchema } = require("./models/likes");
const { shareMemorySchema } = require("./models/sharedMemory");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const Users = mongoose.model("user", userSchema);
const Memories = mongoose.model("memories", memoriesSchema);
const Comments = mongoose.model("comments", commentsSchema);
const Likes = mongoose.model("likes", likesSchema);
// const shareMemory = mongoose.model("sharedMemory", shareMemorySchema);

module.exports = {
  Users,
  Memories,
  Comments,
  Likes
};
