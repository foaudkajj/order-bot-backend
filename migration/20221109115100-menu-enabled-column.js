const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class menuEnabledColumn20221109115100 {

    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `menu` ADD COLUMN `enabled` boolean default true;");
        await queryRunner.query("ALTER TABLE `menu` ADD COLUMN `role` varchar(50) NULL;");

        await queryRunner.query(
            "ALTER TABLE \`permission\` DROP FOREIGN KEY \`FK_276b5d6df236e69df2a2fa950e8\`",
          );
        await queryRunner.query("ALTER TABLE `permission` DROP COLUMN `menuId`");


        await queryRunner.query("INSERT INTO `permission` (`id`, `permissionKey`, `parentKey`, `isParent`) VALUES (45, 'SHOW_ADMIN_MENUS', NULL, 1);");
        await queryRunner.query("INSERT INTO `permission` (`id`, `permissionKey`, `parentKey`, `isParent`) VALUES (46, 'SHOW_PRODUCTS_MANAGEMENT_MENUS', NULL, 1);");
        await queryRunner.query("UPDATE `menu` SET `role` ='SHOW_ADMIN_MENUS'  WHERE `id` = 3;")
        await queryRunner.query("UPDATE `menu` SET `role` ='SHOW_PRODUCTS_MANAGEMENT_MENUS'  WHERE `id` = 4;")


        await queryRunner.query("INSERT INTO `role_and_permission` (`id`, `permissionId`, `roleId`) VALUES (25, 45, 1);");
        await queryRunner.query("INSERT INTO `role_and_permission` (`id`, `permissionId`, `roleId`) VALUES (26, 46, 1);");

        await queryRunner.query("UPDATE `menu` SET `role`= 'SHOW_USER'       WHERE `id` = 2;");
        await queryRunner.query("UPDATE `menu` SET `role`= 'SHOW_CATEGORY'   WHERE `id` = 5;")
        await queryRunner.query("UPDATE `menu` SET `role`= 'SHOW_PRODUCT'    WHERE `id` = 6;")
        await queryRunner.query("UPDATE `menu` SET `role`= 'SHOW_ORDER'      WHERE `id` = 7;")
        await queryRunner.query("UPDATE `menu` SET `role` ='SHOW_DASHBOARD'  WHERE `id` = 12;")

    }

    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `menu` DROP COLUMN `enabled`;");
        await queryRunner.query("ALTER TABLE `menu` DROP COLUMN `role`;");
        await queryRunner.query("ALTER TABLE `permission` ADD COLUMN `menuId` integer null;"); // this is a foriegn key to menu table.

        await queryRunner.query("DELETE FROM `role_and_permission` where `id` in(25, 26);");

    }

}
