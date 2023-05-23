const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
    bookCount: Int
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(input: LoginInput!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookDetails: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
