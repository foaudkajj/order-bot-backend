const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class MenusRolesModifictaion20240505171300 {

    async up(queryRunner) {

        await queryRunner.query('ALTER TABLE \`menu\` MODIFY COLUMN \`icon\` varchar(50) NULL');
        await queryRunner.query('INSERT INTO `menu` ( `menuKey`, `icon`, `title`, `translate`, `url`, `parentId`, `isParent`, `priority`, `enabled`, `role`) VALUES ( "ROLE_MANAGEMENT", "fa-solid fa-user-gear", null, "NAV.ROLE_MANAGEMENT", "/rolemanagement", "ADMIN_MENUS", 0, 0, 1, "SHOW_ROLE");');
        await queryRunner.query("UPDATE `permission` SET `parentKey` ='SHOW_ADMIN_MENUS'  WHERE `id` in (22, 26);");
        await queryRunner.query("UPDATE `permission` SET `parentKey` ='SHOW_PRODUCTS_MANAGEMENT_MENUS'  WHERE `id` in (34, 30);");
    }

    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE \`order\` MODIFY COLUMN \`icon\` varchar(20) NULL');
        await queryRunner.query("UPDATE `permission` SET `parentKey` = null  WHERE `id` in (22, 26, 30, 34);");
        await queryRunner.query('DELETE FROM `permission` where `menuKey` = "ROLE_MANAGEMENT" ;');

    }

}
