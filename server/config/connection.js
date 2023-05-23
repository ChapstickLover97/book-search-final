const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log('MongoDB connected successfully!');
}).catch(err => {
  console.log(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection is open');
});

mongoose.connection.on('error', err => {
    console.log('Mongoose default connection has occurred ' + err + ' error');
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection is disconnected');
});

module.exports = mongoose.connection;
