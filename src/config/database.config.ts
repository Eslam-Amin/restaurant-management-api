export default () => ({
  mongo: {
    uri: process.env.MONGO_DB_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGO_DB_NAME || 'restaurants_DB',
  },
});
