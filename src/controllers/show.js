const { Role, User, Permission } = require("../models");
const pluck = require("arr-pluck");
const _ = require("lodash");

const index = async (req, res) => {
  const user = await User.findAll({
    attributes: ["username", "email"],
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
  });

  const roles = user.map((value) => pluck(value.Roles, "roleName"));

  const permissions = user.map((value) =>
    value.Roles.map((value) => pluck(value.Permissions, "permissionName"))
  );

  const filterUser = {
    username: user[0].username,
    email: user[0].email,
    roles: _.flattenDepth(roles),
    permissions: _.flattenDepth(permissions, 2),
  };
  res.status(200).json(filterUser);
};

module.exports = {
  index,
};
