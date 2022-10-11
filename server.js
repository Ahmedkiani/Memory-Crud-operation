require("dotenv").config();

const express = require("express");
const { getUserId } = require("./helper");
const DataLoader = require("dataloader");

const { ApolloServer } = require("apollo-server-express");
const app = express();
const userResolvers = require("./data/resolver");
const typeDefs = require("./data/graphql.schema");
const setContext = require("apollo-link-context").setContext;

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: userResolvers,
  context: ({ req }) => {
    // console.log("token",req.headers.authorization)
    return { userId: getUserId(req) };
  },
});
server.start().then(() => {
  server.applyMiddleware({ app });
});

app.get("/", (req, res) => {
  console.log("Apollo GraphQL Express server is ready");
});

app.listen({ port: 3000 }, () => {
  console.log(
    `Server is running at http://localhost:3000${server.graphqlPath}`
  );
});
