const authRoute = require("./api/authRoute");

const apiRoutes = (app) => {
  app.use("/api/auth", authRoute);
};

module.exports = {
  apiRoutes,
};
