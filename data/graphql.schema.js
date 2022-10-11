const { gql } = require("apollo-server-express");
const typeDefs = gql`
  type User {
    id: ID
    email: String
    name: String
  }
  type Error {
    message: String
    code: Int
    data: String
  }
  union error = Error | User | Memories | Comment
  union error1 = Error | memoryError
  type Memories {
    _id: ID
    title: String
    description: String
    tags: [String]
    image: [String]
    comments: [Comment]!
    likes: [Like]!
    userId: User!
    memoryId: Memories!
  }
  type Comment {
    _id: ID
    userId: String!
    memoryId: String!
    comment: String!
  }
  input memoriesInput {
    title: String
    description: String
    tags: [String]
    image: [String]
    comments: [String]
    likes: Int
    userId: String
    sharedFromUserId: String
  }
  input UserInput {
    email: String
    name: String
    password: String
  }
  input UserLoginInput {
    email: String
    password: String
  }
  input UserIdInput {
    id: String
  }
  input CommentInput {
    userId: String
    memoryId: String
    comment: String
  }
  type Like {
    id: ID!
    memoryId: String!
    userId: String!
  }
  input LikeInput {
    memoryId: String!
  }
  type memoryError {
    memory: [Memories]!
  }
  type Query {
    getAllMemories(input: UserIdInput): error1
    userLogin(input: UserLoginInput): error
    getMemory(memoryId: String): Memories
  }

  type Mutation {
    createUser(input: UserInput): User
    addMemories(input: memoriesInput): error
    createComment(input: CommentInput): error
    likeMemory(input: LikeInput): error
  }
`;
module.exports = typeDefs;
