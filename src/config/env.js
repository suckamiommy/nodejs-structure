require("dotenv").config();

let config = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
};

switch (process.env.NODE_ENV) {
  case "development":
    config = {
      ...config,
      db: {
        username: process.env.DB_USER_NAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
      },
    };
    break;
  case "test":
    config = {
      ...config,
      db: {
        username: process.env.CI_DB_USER_NAME,
        password: process.env.CI_DB_PASSWORD,
        name: process.env.CI_DB_NAME,
        host: process.env.CI_DB_HOST,
        port: process.env.CI_DB_PORT,
        dialect: process.env.CI_DB_DIALECT,
      },
    };
    break;
  case "production":
    config = {
      ...config,
      db: {
        username: process.env.PROD_DB_USER_NAME,
        password: process.env.PROD_DB_PASSWORD,
        name: process.env.PROD_DB_NAME,
        host: process.env.PROD_DB_HOST,
        port: process.env.PROD_DB_PORT,
        dialect: process.env.PROD_DB_DIALECT,
      },
    };
    break;
  default:
    config = {
      ...config,
      db: {
        username: process.env.DB_USER_NAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
      },
    };
}

module.exports = config;
