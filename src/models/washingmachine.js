"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WashingMachine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Branch, {
        foreignKey: {
          name: "branchId",
          allowNull: false,
        },
      });
    }
  }
  WashingMachine.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      wmCode: DataTypes.STRING(10),
      branchId: DataTypes.BIGINT,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "WashingMachine",
    }
  );
  return WashingMachine;
};
