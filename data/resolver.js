const { Users, Memories, Comments, Likes } = require("../db/dbConnector");
const { login, findAllMemories } = require("../helper");
/**
 * GraphQL Resolvers
 **/
const resolvers = {
  Query: {
    getAllMemories: async (root, { input }, context) => {
      if (context.userId) {
        const userId = input.id;
        const result = await findAllMemories(userId);
        if (result) {
          return { memory: result };
        } else {
          return {
            message: "sorry , did not find any memory against userId",
            code: 200,
          };
        }
      } else {
        return {
          message: "User not valid",
        };
      }
    },
    userLogin: async (root, { input }) => {
      const email = input.email;
      const password = input.password;
      const result = await login(email, password);
      if (result) {
        return result;
      } else {
        return {
          message: "not valid credential",
          code: 200,
        };
      }
    },
    getMemory: async (parent, args, context) => {
      if (context.userId) {
        const memory = await Memories.findOne({ _id: args.memoryId });
        if (memory) {
          return memory;
        } else {
          return {
            message: "Couldn't find any memory against this id",
            code: 200,
          };
        }
      } else {
        return {
          message: "User not valid",
        };
      }
    },
  },
  Memories: {
    memoryId: async (parent) => {
      const memoryId = parent._id;
      const result = await Memories.findOne({ _id: memoryId });
      if (result) {
        return result;
      } else {
        return {
          message: "not found",
          code: 200,
          data: null,
        };
      }
    },
    userId: async (parent) => {
      const userId = parent.userId;
      const result = await Users.findOne({ _id: userId });
      if (result) {
        return result;
      } else {
        return {
          message: "not found",
          code: 200,
          data: null,
        };
      }
    },
    comments: async (parent) => {
      const memoryId = parent._id;

      const result = await Comments.find({ memoryId: memoryId });
      if (result) {
        return result;
      } else {
        return {
          message: "Couldn't find any Memory against this id",
          code: 200,
          data: null,
        };
      }
    },
  },
  error: {
    __resolveType(obj, context, info) {
      if (obj.email) {
        return "User";
      }
      if (obj.message) {
        return "Error";
      }
      if (obj.userId) {
        return "Memories";
      }

      return null;
    },
  },
  error1: {
    __resolveType(obj, context, info) {
      console.log("obj", obj);
      if (obj.memory) {
        return "memoryError";
      } else {
        return "Error";
      }

      return null;
    },
  },
  Mutation: {
    createUser: (root, { input }) => {
      const newUser = new Users({
        name: input.name,
        email: input.email,
        password: input.password,
      });

      newUser.id = newUser._id;

      return new Promise((resolve, reject) => {
        newUser.save((err) => {
          if (err) reject(err);
          else resolve(newUser);
        });
      });
    },
    addMemories: async (root, { input }, context) => {
      if (context.userId) {
        if (input.sharedFromUserId) {
          const newMemory = new Memories({
            title: input.title,
            description: input.description,
            tags: input.tags,
            image: input.image,
            userId: input.userId,
            sharedFrom: input.sharedFromUserId,
          });
          newMemory.id = newMemory._id;
          return new Promise((resolve, reject) => {
            newMemory.save((err) => {
              if (err) reject(err);
              else resolve(newMemory);
            });
          });
        } else {
          const newMemory = new Memories({
            title: input.title,
            description: input.description,
            tags: input.tags,
            image: input.image,
            userId: input.userId,
          });
          newMemory.id = newMemory._id;

          return new Promise((resolve, reject) => {
            newMemory.save((err) => {
              if (err) reject(err);
              else resolve(newMemory);
            });
          });
        }
      } else {
        return {
          message: "User not valid",
        };
      }
    },
    createComment: async (root, { input }, context) => {
      if (context.userId) {
        const memory = await Memories.findById(input.memoryId);
        if (memory) {
          const newComment = new Comments({
            userId: input.userId,
            memoryId: input.memoryId,
            comment: input.comment,
          });

          newComment.id = newComment._id;
          await newComment.save();
          return {
            message: "Comment added Successfully",
            code: 200,
            data: newComment,
          };
        } else {
          return {
            message: "there is not Memory against this id",
            code: 200,
          };
        }
      } else {
        return {
          message: "User not valid",
        };
      }
    },
    // likeMemory: async (root, { input }) => {
    //   const memory = await Memories.findById(input.memoryId);
    //   const user = await User.findById(input.userId);
    //   if ((memory, user)) {
    //     // console.log( memory.likes[0].userId);
    //     // console.log( user._id);
    //     if (memory.likes.find((like) => like.userId == user._id)) {
    //       memory.likes = memory.likes.filter((like) => like.userId != user._id);
    //       await memory.save();
    //       return {
    //         message: "UnLiked Comment",
    //         code: 200,
    //       };
    //     } else {
    //       memory.likes.push({
    //         userId: user._id,
    //       });
    //     }
    //     await memory.save();
    //     console.log(memory);
    //     // return memory;
    //     return {
    //       message: "Liked Comment",
    //       code: 200,
    //       data: memory,
    //     };
    //   } else {
    //     return {
    //       message: "Cannot like this post ",
    //       code: 402,
    //     };
    //   }
    // },
    likeMemory: async (root, { input }, context) => {
      if (context.userId) {
        const memory = await Memories.findById(input.memoryId);
        // const user = await Users.findById(input.userId);
        const memoryBeforeLiked = await Likes.find({
          memoryId: input.memoryId,
          userId: context.userId,
        });
        if (memoryBeforeLiked.length) {
          const unlike = await Likes.findOneAndDelete({
            id: memoryBeforeLiked._id,
          });
          return {
            message: "UnLiked Successfully",
            code: 200,
            data: unlike,
          };
        } else {
          if (memory) {
            const newLike = new Likes({
              userId: context.userId,
              memoryId: input.memoryId,
              flag: 1,
            });
            newLike.id = newLike._id;
            await newLike.save();
            return {
              message: "Liked Successfully",
              code: 200,
              data: newLike,
            };
          } else {
            return {
              message: "there is not Memory against",
              code: 402,
            };
          }
        }
      } else {
        return {
          message: "User not valid",
        };
      }
    },
  },
};
module.exports = resolvers;
