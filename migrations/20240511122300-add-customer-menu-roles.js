const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddCustomerMenuRoles20240511122300 {

    async up(queryRunner) {
        await queryRunner.query(`
        INSERT INTO permission ( permission_key,            parent_key,             is_parent) VALUES
                               ("SHOW_CUSTOMER",            NULL,                  1),
                               ("ADD_CUSTOMER",            "SHOW_CUSTOMER",        0),
                               ("DELETE_CUSTOMER",         "SHOW_CUSTOMER",        0),
                               ("UPDATE_CUSTOMER",         "SHOW_CUSTOMER",        0);
        `);

        await queryRunner.query(`
        INSERT INTO menu (menu_key,     icon,                title,  translate,         url,          parent_id,    is_parent, priority, enabled, role) VALUES
                         ('CUSTOMERS',  'fa-solid fa-users',  NULL,  'NAV.CUSTOMERS',   '/customers', 'ADMIN_MENUS', 0,         0,          1,  'SHOW_CUSTOMER');
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
        DELETE FROM permission WHERE permission_key IN ("SHOW_CUSTOMER", "ADD_CUSTOMER", "DELETE_CUSTOMER", "UPDATE_CUSTOMER");
        `);

        await queryRunner.query(`
        DELETE FROM menu WHERE menu_key IN ("CUSTOMERS");
        `);
    }

}
