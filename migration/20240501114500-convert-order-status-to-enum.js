const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class ConvertOrderStatusToEnum20240501114500 {

    async up(queryRunner) {
        await queryRunner.query(
            "ALTER TABLE \`order\` MODIFY COLUMN \`orderStatus\` enum ('NEW','USER_CONFIRMED','MERCHANT_CONFIRMED','PREPARED','ORDER_SENT','DELIVERED','CANCELLED','FUTURE_ORDER','CONFIRMED_FUTURE_ORDER') NOT NULL DEFAULT 'NEW'",
          );
    }

    async down(queryRunner) {
        await queryRunner.query(
            "ALTER TABLE \`order\` MODIFY COLUMN \`orderStatus\` enum ('SELECTED', 'INBASKET') NOT NULL",
          );
    }

}
