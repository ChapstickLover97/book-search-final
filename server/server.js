const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
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

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

const startServer = async () => {
  try {
    await db; // Wait for the database connection to establish
    await server.start();
    server.applyMiddleware({ app });

    // All remaining requests return the React app, so it's important this line is last.
    if (process.env.NODE_ENV === 'production') {
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
      });
    }

    app.listen(PORT, () => {
      console.log(`Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database', err);
  }
};

startServer();