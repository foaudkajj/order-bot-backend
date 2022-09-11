const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class addRolePermissions20221109153500 {

    async up(queryRunner) {

    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`PermissionKey\`, \`ParentKey\`, \`IsParent\`) VALUES (21, 'SHOW_ROLE', NULL, 1);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`PermissionKey\`, \`ParentKey\`, \`IsParent\`) VALUES (26, 'ADD_ROLE', 'SHOW_ROLE', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`PermissionKey\`, \`ParentKey\`, \`IsParent\`) VALUES (27, 'DELETE_ROLE', 'SHOW_ROLE', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`PermissionKey\`, \`ParentKey\`, \`IsParent\`) VALUES (28, 'UPDATE_ROLE', 'SHOW_ROLE', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`PermissionKey\`, \`ParentKey\`, \`IsParent\`) VALUES (29, 'UPATE_PERMISSIONS', 'SHOW_ROLE', 0);`);

    await queryRunner.query(
      `INSERT INTO \`role_and_permission\` (\`id\`, \`permissionId\`, \`roleId\`) VALUES (1, 21, 1);`,
    );
    await queryRunner.query(
      `INSERT INTO \`role_and_permission\` (\`id\`, \`permissionId\`, \`roleId\`) VALUES (6, 26, 1);`,
    );
    await queryRunner.query(
      `INSERT INTO \`role_and_permission\` (\`id\`, \`permissionId\`, \`roleId\`) VALUES (7, 27, 1);`,
    );
    await queryRunner.query(
      `INSERT INTO \`role_and_permission\` (\`id\`, \`permissionId\`, \`roleId\`) VALUES (8, 28, 1);`,
    );
    await queryRunner.query(
      `INSERT INTO \`role_and_permission\` (\`id\`, \`permissionId\`, \`roleId\`) VALUES (9, 29, 1);`,
    );
    }

    async down(queryRunner) {

        await queryRunner.query(`DELETE FROM \`role_and_permission\` where id in (1,6,7,8,9);`);
        await queryRunner.query(`DELETE FROM \`permission\` where id in (21,26,27,28,29);`);
    }

}
