"use strict";
const bcrypt = require("bcrypt");
const config = require("../config/index");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPwd = bcrypt.hashSync("adminadmin", config.auth.saltRounds);

    // Insert demo users
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "admin",
          password: hashedPwd,
          email: "admin@admin.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Insert demo roles
    await queryInterface.bulkInsert("Roles", [
      {
        roleName: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert demo Permission
    await queryInterface.bulkInsert("Permissions", [
      {
        permissionName: "view",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permissionName: "create",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permissionName: "update",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permissionName: "delete",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert relational Users has Roles
    const users = await queryInterface.sequelize.query(`SELECT id from "Users";`);

    const roles = await queryInterface.sequelize.query(`SELECT id from "Roles";`);

    const userRows = users[0];
    const roleRows = roles[0];

    await queryInterface.bulkInsert(
      "UsersRoles",
      [
        {
          userId: userRows[0].id,
          roleId: roleRows[0].id,
        },
      ],
      {}
    );

    // Insert relational Roles has Permissions
    let arrRolesHasPermissions = [];

    const permissions = await queryInterface.sequelize.query(`SELECT id from "Permissions";`);

    const permissionRows = permissions[0];

    permissionRows.map((value, _) => {
      arrRolesHasPermissions.push({
        roleId: roleRows[0].id,
        permissionId: value.id,
      });
    });

    await queryInterface.bulkInsert("RolesPermissions", arrRolesHasPermissions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UsersRoles", null, {});
    await queryInterface.bulkDelete("RolesPermissions", null, {});
    await queryInterface.bulkDelete("Roles", null, {});
    await queryInterface.bulkDelete("Permissions", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
