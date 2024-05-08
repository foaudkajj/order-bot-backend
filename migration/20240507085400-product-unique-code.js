const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class ProductUniqueCode20240507085400 {

    async up(queryRunner) {
        await queryRunner.query("ALTER TABLE `product` ADD COLUMN `code` varchar(6) not null after unitPrice;");
        await queryRunner.query("ALTER TABLE `product` CHANGE `merchantId` `merchant_id` int not null;");
        await queryRunner.query("create unique index `uq_product_code` on `product` (`merchant_id`, `code`);");
    }

    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `product` DROP COLUMN `code`;");
        await queryRunner.query("ALTER TABLE `product` CHANGE `merchant_id` `merchantId` int not null;");
    }

}
