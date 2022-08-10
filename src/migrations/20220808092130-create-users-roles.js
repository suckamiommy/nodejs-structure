"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UsersRoles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      roleId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Roles",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UsersRoles");
  },
};
