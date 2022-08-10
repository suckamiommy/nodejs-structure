const { Role, User } = require("../models");

const index = async (req, res) => {
  const roles = await Role.findAll({
    include: [
      {
        model: User,
        through: {
          attributes: [],
        },
      },
    ],
  });
  res.status(200).json(roles);
};

module.exports = {
  index,
};
