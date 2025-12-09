const env = process.env.ENVIRONMENT;

function initEnv() {
  if (['production', 'development'].includes(env)) return;
  require('dotenv').config();
}

initEnv();

module.exports = {
  production: false,
  server: {
    port: '4000',
  },
  mongoDb: {
    uri: process.env.MONGO_URI,
  },
  mongodb: {
    users: process.env.USERS,
    categories: process.env.CATEGORIES,
  },
  appVersion: '0.0.1',
  jwtSecret: 'your-super-secret-jwt-key',
};
