"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Role, {
        through: "RolesPermissions",
        foreignKey: "permissionId",
      });
    }
  }
  Permission.init(
    {
      permissionName: { type: DataTypes.STRING(20), unique: true },
    },
    {
      sequelize,
      modelName: "Permission",
    }
  );
  return Permission;
};
