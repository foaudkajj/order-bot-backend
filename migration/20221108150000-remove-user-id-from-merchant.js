const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class removeUserIdFromMerchant20221108150000 {

    async up(queryRunner) {
        await queryRunner.query(
            "ALTER TABLE \`merchant\` DROP FOREIGN KEY \`FK_4973a7acae8e2f6bfac7a781ceb\`",
          );
          await queryRunner.query(
            "ALTER TABLE \`merchant\` DROP COLUMN \`userId\`",
          );
    }

    async down(queryRunner) {
            // not possilbe to re-add a foreign key when the table contains rows.
    }
}