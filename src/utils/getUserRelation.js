// required main dependencies
const _ = require("lodash");
const pluck = require("arr-pluck");

// required logger and handler
const Logger = require("../utils/logger");
const logger = new Logger();
const pathFile = logger.getLabel(__filename);
const Handler = require("../utils/handler");
const handler = new Handler(logger, pathFile);
const status = require("../utils/status");

// required model
const { User, Role, Permission } = require("../models");

const findUserRelation = async (res, username) => {
  try {
    const options = {
      where: { username },
      attributes: ["id", "username", "email"],
      include: [
        {
          attributes: ["roleName"],
          model: Role,
          through: {
            attributes: [],
          },
          include: [
            {
              attributes: ["permissionName"],
              model: Permission,
              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
    };

    const user = await User.findOne(options);

    const roles = pluck(user.Roles, "roleName");

    const permissions = user.Roles.map((value) => pluck(value.Permissions, "permissionName"));

    const filterUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: _.flattenDepth(roles),
      permissions: _.flattenDepth(permissions),
    };

    return filterUser;
  } catch (error) {
    return handler.error(res, status.ServerError, "CATCH_GETUSER_RELATION", error);
  }
};

module.exports = {
  findUserRelation,
};
