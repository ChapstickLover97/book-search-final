const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
        return userData;
      }

      throw new Error('Not logged in');
    },
  },

  Mutation: {
    login: async (parent, { input }) => {
      const { email, password } = input;
  
      const user = await User.findOne({ $or: [{ email }, { username: email }] });
  
      if (!user) {
        throw new Error('No user found with this email address');
      }
  
      const correctPw = await user.isCorrectPassword(password);
  
      if (!correctPw) {
        throw new Error('Incorrect password');
      }
  
      const token = signToken(user);
  
      return { token, user };
    },
  

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (parent, { bookDetails }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookDetails } },
          { new: true }
        );

        return updatedUser;
      }

      throw new Error('You need to be logged in!');
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedUser;
      }

      throw new Error('You need to be logged in!');
    },
  },
};

module.exports = resolvers;