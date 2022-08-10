const showRoute = require("./api/show");

const apiRoutes = (app) => {
  app.use("/api/show", showRoute);
};

module.exports = {
  apiRoutes,
};
