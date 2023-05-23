const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection'); // assuming this is the path to your connection.js file
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers/resolvers');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();

