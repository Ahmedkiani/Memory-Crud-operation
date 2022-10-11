const User = require("./db/models/users");
const Memories = require("./db/models/memories");
const token = require("./utils/jwt");

async function login(email, password) {
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      if (user.password === password) {
        let access = token.createAccessToken({ id: user._id });
        // return;

        return {
          code: 200,
          message: "The user is successfully logged in",
          data: access,
          // return user;
        };
      } else {
        return {
          message: " Credential is not valid",
        };
      }
    } else {
      return {
        message: "User does not exist",
      };
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
async function findAllMemories(id) {
  let finder;
  try {
    finder = await Memories.find({ userId: id }).lean();
    if (finder == null) {
      return {
        message: "Cannot find memory against userId",
      };
    } else {
      return finder;
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
function getUserId(req) {
  let bearer = req.headers.authorization;
  bearer = bearer.replace("Bearer ", "");
  let userTokenPayload = token.verifyAccessToken(bearer);
  return userTokenPayload.id;
}
module.exports = {
  login,
  findAllMemories,
  getUserId,
};
