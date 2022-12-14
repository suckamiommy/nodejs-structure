"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {
        through: "UsersRoles",
        foreignKey: "roleId",
      });
      this.belongsToMany(models.Permission, {
        through: "RolesPermissions",
        foreignKey: "roleId",
      });
    }
  }
  Role.init(
    {
      roleName: { type: DataTypes.STRING(20), unique: true },
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return Role;
};
