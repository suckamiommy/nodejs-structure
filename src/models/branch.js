"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
      });
      this.hasMany(models.WashingMachine, {
        foreignKey: {
          name: "branchId",
          allowNull: false,
        },
      });
    }
  }
  Branch.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: DataTypes.BIGINT,
      branchCode: { type: DataTypes.STRING(10), allowNull: false },
      branchName: { type: DataTypes.STRING(20), allowNull: false },
      address: { type: DataTypes.TEXT, allowNull: false },
      latitude: { type: DataTypes.DECIMAL(8, 6) },
      longitude: { type: DataTypes.DECIMAL(9, 6) },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Branch",
    }
  );
  return Branch;
};
