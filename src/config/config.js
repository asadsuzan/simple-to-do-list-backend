// config/config.js

module.exports = {
  // MongoDB configuration
  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || "todo_list_db",
    username: process.env.DB_USERNAME || "your_db_username",
    password: process.env.DB_PASSWORD || "your_db_password",
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || "your_jwt_secret", // Change this to a strong, random string
    expiresIn: process.env.JWT_EXPIRES_IN || "1d", // Token expiration time (e.g., 1 day)
  },

  // Server configuration
  server: {
    port: process.env.PORT || 3000, // Use the provided port or default to 3000
  },
};
