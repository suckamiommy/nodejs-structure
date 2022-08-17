"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolesPermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RolesPermissions.init(
    {
      roleId: DataTypes.BIGINT,
      permissionId: DataTypes.BIGINT,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "RolesPermissions",
    }
  );
  return RolesPermissions;
};
