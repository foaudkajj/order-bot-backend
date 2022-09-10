const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class removeUserIdFromMerchant1662822665520 {

    async up(queryRunner) {
        await queryRunner.query(
            `ALTER TABLE merchant DROP FOREIGN KEY FK_4973a7acae8e2f6bfac7a781ceb`,
          );
    }

    async down(queryRunner) {

        // not possilbe to re-add a foreign key when the table contains rows.


    }
}