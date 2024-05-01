const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddCreateDateToCustomerTable20240501145200 {

    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `customer` ADD COLUMN `create_date` datetime default CURRENT_TIMESTAMP;");
    }

    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `customer` DROP COLUMN `create_date`;");
    }

}
