import mongoose from 'mongoose';

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;
const isTest = process.env.NODE_ENV === 'test';
if (isTest) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
} else if (isDevelopment) {
  process.env.MONGODB_URI = 'mongodb://mongo-db:27017/gmailpush';
  mongoose.set('debug', true);
}
console.log(process.env.MONGO_URL, 'process.env.MONGODB_URI')
mongoose.connect(process.env.MONGO_URL);
