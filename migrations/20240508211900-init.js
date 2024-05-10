const {MigrationInterface, QueryRunner} = require('typeorm');

module.exports = class init20240508211900 {
  // please create new db before starting the app.
  async up(queryRunner) {

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;')
    await queryRunner.query(
      `
      CREATE TABLE \`category\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(30) NOT NULL,
        \`category_key\` varchar(50) NOT NULL,
        \`merchant_id\` int NOT NULL,
        \`getir_category_id\` varchar(255) NULL DEFAULT NULL,
        CONSTRAINT \`pk_category\` PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_category_merchant\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchant\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
      ) ENGINE = InnoDB;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`customer\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`full_name\` varchar(30)  NOT NULL,
        \`telegram_user_name\` varchar(30)  NULL DEFAULT NULL,
        \`telegram_id\` double NULL DEFAULT NULL,
        \`phone_number\` varchar(30)  NULL DEFAULT NULL,
        \`location\` varchar(1000)  NULL DEFAULT NULL,
        \`address\` varchar(1000)  NULL DEFAULT NULL,
        \`customer_channel\` enum('TELEGRAM','YEMEKSEPETI','GETIR','PANEL')  NOT NULL,
        \`merchant_id\` int NOT NULL,
        \`create_date\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT \`pk_customer\` PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_customer_merchant\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchant\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
      ) ENGINE = InnoDB ;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`getir_order\`  (
        \`id\` varchar(255)  NOT NULL,
        \`status\` int NOT NULL,
        \`is_scheduled\` tinyint NOT NULL,
        \`confirmation_id\` varchar(255)  NOT NULL,
        \`client_id\` varchar(255)  NOT NULL,
        \`client_name\` varchar(255)  NOT NULL,
        \`client_contact_phone_number\` varchar(255)  NOT NULL,
        \`client_phone_number\` varchar(255)  NOT NULL,
        \`client_delivery_address_id\` varchar(255)  NOT NULL,
        \`client_delivery_address\` varchar(255)  NOT NULL,
        \`client_city\` varchar(255)  NOT NULL,
        \`client_district\` varchar(255)  NOT NULL,
        \`client_location\` varchar(255)  NOT NULL,
        \`courier_id\` varchar(255)  NOT NULL,
        \`courier_status\` int NOT NULL,
        \`courier_name\` varchar(255)  NOT NULL,
        \`courier_location\` varchar(255)  NOT NULL,
        \`client_note\` varchar(4000)  NOT NULL,
        \`do_not_knock\` tinyint NOT NULL,
        \`drop_off_at_door\` tinyint NOT NULL,
        \`total_price\` int NOT NULL,
        \`checkout_date\` varchar(255)  NOT NULL,
        \`delivery_type\` int NOT NULL,
        \`is_eco_friendly\` tinyint NOT NULL,
        \`payment_method_id\` int NOT NULL,
        \`payment_method_text\` varchar(255)  NOT NULL,
        \`restaurant_id\` varchar(255)  NOT NULL,
        \`order_id\` int NULL DEFAULT NULL,
        CONSTRAINT \`pk_getir_order\` PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB ;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`menu\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`menu_key\` varchar(50)  NOT NULL,
        \`icon\` varchar(50)  NULL DEFAULT NULL,
        \`title\` varchar(50)  NULL DEFAULT NULL,
        \`translate\` varchar(200)  NULL DEFAULT NULL,
        \`url\` varchar(300)  NULL DEFAULT NULL,
        \`parent_id\` varchar(50)  NULL DEFAULT NULL,
        \`is_parent\` tinyint NOT NULL,
        \`priority\` int NOT NULL,
        \`enabled\` tinyint(1) NULL DEFAULT 1,
        \`role\` varchar(50)  NULL DEFAULT NULL,
        CONSTRAINT \`pk_menu\` PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`merchant\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`bot_user_name\` varchar(50)  NULL DEFAULT NULL,
        \`bot_token\` varchar(50)  NULL DEFAULT NULL,
        \`is_active\` tinyint NOT NULL DEFAULT 1,
        \`getir_app_secret_key\` varchar(50)  NULL DEFAULT NULL,
        \`getir_restaurant_secret_key\` varchar(50)  NULL DEFAULT NULL,
        \`getir_access_token\` varchar(2000)  NULL DEFAULT NULL,
        \`getir_token_last_created\` datetime NULL DEFAULT NULL,
        \`getir_restaurant_id\` varchar(50)  NULL DEFAULT NULL,
        \`ys_app_secret_key\` varchar(50)  NULL DEFAULT NULL,
        \`ys_restaurant_secret_key\` varchar(50)  NULL DEFAULT NULL,
        CONSTRAINT \`pk_merchant\` PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB;
      `,
    );

    // await queryRunner.query(
    //   `
    //   CREATE TABLE \`migrations\`  (
    //     \`id\` int NOT NULL AUTO_INCREMENT,
    //     \`timestamp\` bigint NOT NULL,
    //     \`name\` varchar(255)  NOT NULL,
    //     CONSTRAINT \`pk_migrations\` PRIMARY KEY (\`id\`)
    //   ) ENGINE = InnoDB;
    //   `,
    // );

    await queryRunner.query(
      `
      CREATE TABLE \`option\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(500)  NOT NULL,
        \`getir_option_id\` varchar(500)  NOT NULL,
        \`price\` decimal(8, 2) NOT NULL DEFAULT 0.00,
        \`option_category_id\` int NOT NULL,
        CONSTRAINT \`pk_option\` PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_option_option_category\` FOREIGN KEY (\`option_category_id\`) REFERENCES \`option_category\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
      ) ENGINE = InnoDB;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`option_category\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(500)  NOT NULL,
        \`getir_option_category_id\` varchar(500)  NOT NULL,
        CONSTRAINT \`pk_option_category\` PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`order\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`order_no\` varchar(36)  NOT NULL,
        \`order_channel\` enum('TELEGRAM','YEMEKSEPETI','GETIR','PANEL')  NOT NULL,
        \`payment_method\` enum('OnDelivery','Online')  NOT NULL,
        \`total_price\` decimal(8, 2) NOT NULL DEFAULT 0.00,
        \`order_status\` enum('NEW','USER_CONFIRMED','MERCHANT_CONFIRMED','PREPARED','ORDER_SENT','DELIVERED','CANCELLED','FUTURE_ORDER','CONFIRMED_FUTURE_ORDER')  NOT NULL DEFAULT 'NEW',
        \`create_date\` datetime NOT NULL,
        \`note\` varchar(4000)  NULL DEFAULT NULL,
        \`cancel_reason\` varchar(4000)  NULL DEFAULT NULL,
        \`customer_id\` int NOT NULL,
        \`getir_order_id\` varchar(255)  NULL DEFAULT NULL,
        \`merchant_id\` int NOT NULL,
        CONSTRAINT \`pk_order\` PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_order_merchant\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchant\` (\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT,
        CONSTRAINT \`fk_order_getir_order\` FOREIGN KEY (\`getir_order_id\`) REFERENCES \`getir_order\` (\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT,
        CONSTRAINT \`fk_order_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customer\` (\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT
      ) ENGINE = InnoDB;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`order_item\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`amount\` int NOT NULL,
        \`item_note\` varchar(2000)  NULL DEFAULT NULL,
        \`product_status\` enum('SELECTED','INBASKET')  NOT NULL,
        \`product_id\` int NOT NULL,
        \`order_id\` int NOT NULL,
        CONSTRAINT \`pk_order_item\` PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_order_item_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\` (\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT,
        CONSTRAINT \`fk_order_item_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
      ) ENGINE = InnoDB;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`order_option\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`price\` decimal(8, 2) NOT NULL,
        \`option_id\` int NOT NULL,
        \`order_item_id\` int NOT NULL,
        CONSTRAINT \`pk_order_option\` PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_order_option_order_item\` FOREIGN KEY (\`order_item_id\`) REFERENCES \`order_item\` (\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT,
        CONSTRAINT \`fk_order_option_option\` FOREIGN KEY (\`option_id\`) REFERENCES \`option\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
      ) ENGINE = InnoDB;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`permission\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`permission_key\` varchar(255)  NOT NULL,
        \`parent_key\` varchar(50)  NULL DEFAULT NULL,
        \`is_parent\` tinyint NOT NULL,
        CONSTRAINT \`pk_permission\` PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`product\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`thumb_url\` varchar(255)  NULL DEFAULT NULL,
        \`title\` varchar(50)  NOT NULL,
        \`description\` varchar(500)  NOT NULL,
        \`unit_price\` decimal(8, 2) NOT NULL,
        \`code\` varchar(6)  NOT NULL,
        \`category_id\` int NOT NULL,
        \`merchant_id\` int NOT NULL,
        \`getir_product_id\` varchar(255)  NULL DEFAULT NULL,
        CONSTRAINT \`pk_product\` PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`uq_product\`(\`merchant_id\`, \`code\`),
        CONSTRAINT \`fk_product_merchant\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchant\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT,
        CONSTRAINT \`fk_product_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
      ) ENGINE = InnoDB;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`role\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`role_name\` varchar(255)  NOT NULL,
        \`description\` varchar(255)  NULL DEFAULT NULL,
        CONSTRAINT \`pk_role\` PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`role_and_permission\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`permission_id\` int NOT NULL,
        \`role_id\` int NOT NULL,
        CONSTRAINT \`pk_role_and_permission\` PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_role_and_permission_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT,
        CONSTRAINT \`fk_role_and_permission_permission\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permission\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
      ) ENGINE = InnoDB;
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE \`user\`  (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`user_name\` varchar(30)  NULL DEFAULT NULL,
        \`user_status\` int NOT NULL,
        \`password\` varchar(255)  NOT NULL,
        \`image_path\` varchar(255)  NULL DEFAULT NULL,
        \`email\` varchar(50)  NULL DEFAULT NULL,
        \`cellphone\` varchar(30)  NULL DEFAULT NULL,
        \`last_succesful_login_date\` datetime NOT NULL,
        \`salt\` varchar(255)  NOT NULL,
        \`name\` varchar(50)  NOT NULL,
        \`last_name\` varchar(50)  NOT NULL,
        \`role_id\` int NOT NULL,
        \`merchant_id\` int NOT NULL,
        CONSTRAINT \`pk_user\` PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_user_merchant\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchant\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT,
        CONSTRAINT \`fk_user_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
      ) ENGINE = InnoDB;
      `,
    );

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;')
    
  }


   async down(queryRunner) {
    await queryRunner.query(
      "ALTER TABLE \`option\` DROP FOREIGN KEY \`fk_option_option_category\`",
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` DROP FOREIGN KEY \`fk_category_merchant\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP FOREIGN KEY \`fk_product_merchant\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP FOREIGN KEY \`fk_product_category\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_item\` DROP FOREIGN KEY \`fk_order_item_order\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_item\` DROP FOREIGN KEY \`fk_order_item_product\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_option\` DROP FOREIGN KEY \`fk_order_option_order_item\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_option\` DROP FOREIGN KEY \`fk_order_option_option\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`fk_order_merchant\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`fk_order_customer\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`fk_order_getir_order\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` DROP FOREIGN KEY \`fk_customer_merchant\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`fk_user_merchant\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`fk_user_role\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_and_permission\` DROP FOREIGN KEY \`fk_role_and_permission_permission\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_and_permission\` DROP FOREIGN KEY \`fk_role_and_permission_role\``,
    );
    await queryRunner.query(`DROP TABLE \`option\``);
    await queryRunner.query(`DROP TABLE \`option_category\``);
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(`DROP TABLE \`product\``);
    await queryRunner.query(`DROP TABLE \`order_item\``);
    await queryRunner.query(`DROP TABLE \`order_option\``);
    await queryRunner.query(`DROP TABLE \`order\``);
    await queryRunner.query(`DROP TABLE \`getir_order\``);
    await queryRunner.query(`DROP TABLE \`customer\``);
    await queryRunner.query(`DROP TABLE \`merchant\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP TABLE \`role_and_permission\``);
    await queryRunner.query(`DROP TABLE \`permission\``);
    await queryRunner.query(`DROP TABLE \`menu\``);
  }
};
