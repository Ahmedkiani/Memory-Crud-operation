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
    getMemory: async (_, args, context) => {
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
    __resolveType(obj) {
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
  memError: {
    __resolveType(obj) {
      if (obj.memory) {
        return "MemoryError";
      } else {
        return "Error";
      }

      return null;
    },
  },
  Mutation: {
    createUser: async (root, { input }) => {
      const newUser = new Users({
        name: input.name,
        email: input.email,
        password: input.password,
      });

      newUser.id = newUser._id;

      await newUser.save();
      return newUser;
    },
    addMemories: async (root, { input }, context) => {
      if (context.userId) {
        if (input.sharedFromUserId) {
          const newMemory = new Memories({
            title: input.title,
            description: input.description,
            tags: input.tags,
            image: input.image,
            userId: context.userId,
            sharedFrom: input.sharedFromUserId,
          });
          newMemory.id = newMemory._id;
          await newMemory.save();
          return {
            message: "shared Memory added Successfully",
            code: 200,
            data: newMemory,
          };
        } else {
          const newMemory = new Memories({
            title: input.title,
            description: input.description,
            tags: input.tags,
            image: input.image,
            userId: context.userId,
          });
          newMemory.id = newMemory._id;
          await newMemory.save();
          return {
            message: "Memory added Successfully",
            code: 200,
            data: newMemory,
          };
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
            userId: context.userId,
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
    likeMemory: async (root, { input }, context) => {
      if (context.userId) {
        const memory = await Memories.findById(input.memoryId);
        const memoryBeforeLiked = await Likes.find({
          memoryId: input.memoryId,
          userId: context.userId,
        });
        if (memoryBeforeLiked.length) {
          const unlike = await Likes.deleteOne({
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
