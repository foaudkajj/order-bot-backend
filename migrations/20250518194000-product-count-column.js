const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class ProductCountColumn20250518194000 {

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE product
            ADD COLUMN count SMALLINT NOT NULL DEFAULT 0
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE product
            DROP COLUMN count;
        `);
    }

}
