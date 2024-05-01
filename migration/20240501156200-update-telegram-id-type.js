const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateTelegramIdType20240501156200 {

    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `customer` CHANGE `telegramId` `telegram_id` DOUBLE NULL;");
    }

    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `customer` CHANGE `telegram_id` `telegramId` INT NULL;");
    }

}
