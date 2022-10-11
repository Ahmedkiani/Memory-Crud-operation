const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Getting One
router.get("/:id", getUser, (req, res) => {
  res.json(res.subscriber);
});

// Creating one
router.post("/", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const User = await newUser.save();
    res.status(201).json(User);
  } catch (err) {
    res.status(400).json({ message: "User email already exist" });
  }
});

router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      if (user.password === password) {
        res.status(201).json({ message: "User successfully logged in" });
      } else {
        res.status(201).json({ message: "Invalid credential" });
      }
    } else {
      res.status(201).json({ message: "User does not exist" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let subscriber;
  try {
    subscriber = await User.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.subscriber = subscriber;
  next();
}

module.exports = router;
