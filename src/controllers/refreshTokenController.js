// required main dependencies
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("../config/index");

// required logger and handler
const Logger = require("../utils/logger");
const logger = new Logger();
const pathFile = logger.getLabel(__filename);
const Handler = require("../utils/handler");
const handler = new Handler(logger, pathFile);
const status = require("../utils/status");

// required model
const { User } = require("../models");

// required utils
const { findUserRelation } = require("../utils/getUserRelation");

const RefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return handler.error(res, status.Unauthorized, "DONT_HAVE_TOKEN");
    const refreshToken = cookies.jwt;

    const options = {
      where: { refreshToken },
    };
    const foundUser = await User.findOne(options);
    if (!foundUser) return handler.error(res, status.Forbidden, "USER_NOTFOUND");

    jwt.verify(refreshToken, config.auth.refresh_token_secret, async (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return handler.error(res, status.Forbidden, "USER_NOTFOUND");

      const userRelation = await findUserRelation(res, decoded.username);
      const payload = _.omit(userRelation, ["id"]);
      const accessToken = jwt.sign({ UserInfo: payload }, config.auth.access_token_secret, { expiresIn: config.auth.access_token_expire });

      return handler.success(res, status.Success, "")({ accessToken });
    });
  } catch (error) {
    return handler.error(res, status.ServerError, "CATCH_REFRESH_TOKEN", error);
  }
};

module.exports = {
  RefreshToken,
};
