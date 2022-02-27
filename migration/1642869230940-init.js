const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class init1642869230940 {
    name = 'init1642869230940'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`menu\` (\`Id\` int NOT NULL AUTO_INCREMENT, \`MenuKey\` varchar(50) NOT NULL, \`Icon\` varchar(20) NULL, \`Title\` varchar(50) NULL, \`Translate\` varchar(200) NULL, \`URL\` varchar(300) NULL, \`ParentId\` varchar(50) NULL, \`IsParent\` tinyint NOT NULL, \`Priority\` int NOT NULL, PRIMARY KEY (\`Id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`permession\` (\`Id\` int NOT NULL AUTO_INCREMENT, \`PermessionKey\` varchar(255) NOT NULL, \`ParentKey\` varchar(50) NULL, \`IsParent\` tinyint NOT NULL, \`menuId\` int NULL, UNIQUE INDEX \`REL_276b5d6df236e69df2a2fa950e\` (\`menuId\`), PRIMARY KEY (\`Id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_and_permession\` (\`Id\` int NOT NULL AUTO_INCREMENT, \`permessionId\` int NOT NULL, \`roleId\` int NOT NULL, PRIMARY KEY (\`Id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`Id\` int NOT NULL AUTO_INCREMENT, \`RoleName\` varchar(255) NOT NULL, \`Description\` varchar(255) NULL, PRIMARY KEY (\`Id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`Id\` int NOT NULL AUTO_INCREMENT, \`UserName\` varchar(30) NULL, \`UserStatus\` int NOT NULL, \`Password\` varchar(255) NOT NULL, \`ImagePath\` varchar(255) NULL, \`Email\` varchar(50) NULL, \`Cellphone\` varchar(30) NULL, \`LastSuccesfulLoginDate\` datetime NOT NULL, \`Salt\` varchar(255) NOT NULL, \`Name\` varchar(50) NOT NULL, \`LastName\` varchar(50) NOT NULL, \`roleId\` int NOT NULL, \`merchantId\` int NOT NULL, PRIMARY KEY (\`Id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`merchant\` (\`Id\` int NOT NULL AUTO_INCREMENT, \`botUserName\` varchar(50) NULL, \`botToken\` varchar(50) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`GetirAppSecretKey\` varchar(50) NULL, \`GetirRestaurantSecretKey\` varchar(50) NULL, \`GetirAccessToken\` varchar(2000) NULL, \`GetirTokenLastCreated\` datetime NULL, \`GetirRestaurantId\` varchar(50) NULL, \`YSAppSecretKey\` varchar(50) NULL, \`YSRestaurantSecretKey\` varchar(50) NULL, \`userId\` int NOT NULL, UNIQUE INDEX \`REL_4973a7acae8e2f6bfac7a781ce\` (\`userId\`), PRIMARY KEY (\`Id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fullName\` varchar(30) NOT NULL, \`telegramUserName\` varchar(30) NULL, \`telegramId\` int NULL, \`phoneNumber\` varchar(30) NULL, \`location\` varchar(1000) NULL, \`address\` varchar(1000) NULL, \`customerChannel\` enum ('TELEGRAM', 'YEMEKSEPETI', 'GETIR', 'PANEL') NOT NULL, \`merchantId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`getir_order\` (\`id\` varchar(255) NOT NULL, \`status\` int NOT NULL, \`isScheduled\` tinyint NOT NULL, \`confirmationId\` varchar(255) NOT NULL, \`clientId\` varchar(255) NOT NULL, \`clientName\` varchar(255) NOT NULL, \`clientContactPhoneNumber\` varchar(255) NOT NULL, \`clientPhoneNumber\` varchar(255) NOT NULL, \`clientDeliveryAddressId\` varchar(255) NOT NULL, \`clientDeliveryAddress\` varchar(255) NOT NULL, \`clientCity\` varchar(255) NOT NULL, \`clientDistrict\` varchar(255) NOT NULL, \`clientLocation\` varchar(255) NOT NULL, \`courierId\` varchar(255) NOT NULL, \`courierStatus\` int NOT NULL, \`courierName\` varchar(255) NOT NULL, \`courierLocation\` varchar(255) NOT NULL, \`clientNote\` varchar(4000) NOT NULL, \`doNotKnock\` tinyint NOT NULL, \`dropOffAtDoor\` tinyint NOT NULL, \`totalPrice\` int NOT NULL, \`checkoutDate\` varchar(255) NOT NULL, \`deliveryType\` int NOT NULL, \`isEcoFriendly\` tinyint NOT NULL, \`paymentMethodId\` int NOT NULL, \`paymentMethodText\` varchar(255) NOT NULL, \`restaurantId\` varchar(255) NOT NULL, \`orderId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order_no\` varchar(36) NOT NULL, \`orderChannel\` enum ('TELEGRAM', 'YEMEKSEPETI', 'GETIR', 'PANEL') NOT NULL, \`paymentMethod\` enum ('OnDelivery', 'ONLINE') NOT NULL, \`totalPrice\` decimal(8,2) NOT NULL DEFAULT '0.00', \`orderStatus\` smallint NOT NULL DEFAULT '0', \`createDate\` datetime NOT NULL, \`note\` varchar(4000) NULL, \`customer_id\` int NOT NULL, \`getirOrderId\` varchar(255) NULL, \`merchantId\` int NOT NULL, UNIQUE INDEX \`REL_60c614712f96cf7ca323ada03f\` (\`getirOrderId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_option\` (\`id\` int NOT NULL AUTO_INCREMENT, \`price\` decimal NOT NULL DEFAULT '0', \`optionId\` int NOT NULL, \`orderItemId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` int NOT NULL, \`itemNote\` varchar(2000) NULL, \`productStatus\` enum ('SELECTED', 'INBASKET') NOT NULL, \`productId\` int NOT NULL, \`orderId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tgQueryResult\` varchar(15) NOT NULL, \`thumbUrl\` varchar(255) NOT NULL, \`title\` varchar(50) NOT NULL, \`description\` varchar(500) NOT NULL, \`productCode\` varchar(50) NOT NULL, \`unitPrice\` decimal NOT NULL DEFAULT '0', \`categoryId\` int NOT NULL, \`merchantId\` int NULL, \`getirProductId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NOT NULL, \`categoryKey\` varchar(50) NOT NULL, \`merchantId\` int NOT NULL, \`getirCategoryId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`option_category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(500) NOT NULL, \`getirOptionCategoryId\` varchar(500) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`option\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(500) NOT NULL, \`getirOptionId\` varchar(500) NOT NULL, \`price\` decimal(8,2) NOT NULL DEFAULT '0.00', \`optionCategoryId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`permession\` ADD CONSTRAINT \`FK_276b5d6df236e69df2a2fa950e8\` FOREIGN KEY (\`menuId\`) REFERENCES \`menu\`(\`Id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_and_permession\` ADD CONSTRAINT \`FK_be903fdc2a1b747959235bb3558\` FOREIGN KEY (\`permessionId\`) REFERENCES \`permession\`(\`Id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_and_permession\` ADD CONSTRAINT \`FK_1412db6c43dc5be5c275f10dae7\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`Id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`Id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`merchant\` ADD CONSTRAINT \`FK_4973a7acae8e2f6bfac7a781ceb\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`Id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customer\` ADD CONSTRAINT \`FK_23778827c741b8937b565a59293\` FOREIGN KEY (\`merchantId\`) REFERENCES \`merchant\`(\`Id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_cd7812c96209c5bdd48a6b858b0\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_60c614712f96cf7ca323ada03f5\` FOREIGN KEY (\`getirOrderId\`) REFERENCES \`getir_order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_293ad75db4c3b2aa62996c75ad1\` FOREIGN KEY (\`merchantId\`) REFERENCES \`merchant\`(\`Id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_option\` ADD CONSTRAINT \`FK_5538b5357ae88e5cbd6e4c02c9c\` FOREIGN KEY (\`optionId\`) REFERENCES \`option\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_option\` ADD CONSTRAINT \`FK_2815908b460a63ff2eddfc1157f\` FOREIGN KEY (\`orderItemId\`) REFERENCES \`order_item\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_904370c093ceea4369659a3c810\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_646bf9ece6f45dbe41c203e06e0\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_ff0c0301a95e517153df97f6812\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_62fcc319202f6ec1f6819e1d5f5\` FOREIGN KEY (\`merchantId\`) REFERENCES \`merchant\`(\`Id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD CONSTRAINT \`FK_5f44aa02d1c66d9a916a409fcb2\` FOREIGN KEY (\`merchantId\`) REFERENCES \`merchant\`(\`Id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`option\` ADD CONSTRAINT \`FK_a166d02c05dd6e9ae2368fd8960\` FOREIGN KEY (\`optionCategoryId\`) REFERENCES \`option_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);


        await queryRunner.query(`INSERT INTO \`siparisbotu\`.\`menu\` (\`Id\`, \`MenuKey\`, \`Icon\`, \`Title\`, \`Translate\`, \`URL\`, \`ParentId\`, \`IsParent\`, \`Priority\`) VALUES (1, 'ROLE_MANAGEMENT', 'key', NULL, 'NAV.ROLE_MANAGEMENT', 'rolemanagement', 'ADMIN_MENUS', 0, 0);`);
        await queryRunner.query(`INSERT INTO \`siparisbotu\`.\`menu\` (\`Id\`, \`MenuKey\`, \`Icon\`, \`Title\`, \`Translate\`, \`URL\`, \`ParentId\`, \`IsParent\`, \`Priority\`) VALUES (2, 'USER_MANAGEMENT', 'card', NULL, 'NAV.USER_MANAGEMENT', 'usermanagement', 'ADMIN_MENUS', 0, 0);`);
        await queryRunner.query(`INSERT INTO \`siparisbotu\`.\`menu\` (\`Id\`, \`MenuKey\`, \`Icon\`, \`Title\`, \`Translate\`, \`URL\`, \`ParentId\`, \`IsParent\`, \`Priority\`) VALUES (3, 'ADMIN_MENUS', 'user', NULL, 'NAV.ADMIN_MENUS', NULL, NULL, 1, 1);`);
        await queryRunner.query(`INSERT INTO \`siparisbotu\`.\`menu\` (\`Id\`, \`MenuKey\`, \`Icon\`, \`Title\`, \`Translate\`, \`URL\`, \`ParentId\`, \`IsParent\`, \`Priority\`) VALUES (4, 'PRODUCTS_MANAGEMENT', NULL, NULL, 'NAV.PRODUCTS_MANAGEMENT', NULL, NULL, 1, 2);`);
        await queryRunner.query(`INSERT INTO \`siparisbotu\`.\`menu\` (\`Id\`, \`MenuKey\`, \`Icon\`, \`Title\`, \`Translate\`, \`URL\`, \`ParentId\`, \`IsParent\`, \`Priority\`) VALUES (5, 'CATEGORIES', NULL, NULL, 'NAV.CATEGORIES', 'bot/categories', 'PRODUCTS_MANAGEMENT', 0, 0);`);
        await queryRunner.query(`INSERT INTO \`siparisbotu\`.\`menu\` (\`Id\`, \`MenuKey\`, \`Icon\`, \`Title\`, \`Translate\`, \`URL\`, \`ParentId\`, \`IsParent\`, \`Priority\`) VALUES (6, 'PRODUCTS', NULL, NULL, 'NAV.PRODUCTS', 'bot/products', 'PRODUCTS_MANAGEMENT', 0, 0);`);
        await queryRunner.query(`INSERT INTO \`siparisbotu\`.\`menu\` (\`Id\`, \`MenuKey\`, \`Icon\`, \`Title\`, \`Translate\`, \`URL\`, \`ParentId\`, \`IsParent\`, \`Priority\`) VALUES (7, 'ORDERS', 'cart', NULL, 'NAV.ORDERS', '/orders', NULL, 0, 0);`);
        await queryRunner.query(`INSERT INTO \`siparisbotu\`.\`menu\` (\`Id\`, \`MenuKey\`, \`Icon\`, \`Title\`, \`Translate\`, \`URL\`, \`ParentId\`, \`IsParent\`, \`Priority\`) VALUES (9, 'ENTEGRATIONS', NULL, NULL, 'NAV.ENTEGRATIONS', NULL, NULL, 1, 3);`);
        await queryRunner.query(`INSERT INTO \`siparisbotu\`.\`menu\` (\`Id\`, \`MenuKey\`, \`Icon\`, \`Title\`, \`Translate\`, \`URL\`, \`ParentId\`, \`IsParent\`, \`Priority\`) VALUES (10, 'GETIR', NULL, NULL, 'NAV.GETIR', 'entegrations/getir-entegration', 'ENTEGRATIONS', 0, 0);`);
        await queryRunner.query(`INSERT INTO \`siparisbotu\`.\`menu\` (\`Id\`, \`MenuKey\`, \`Icon\`, \`Title\`, \`Translate\`, \`URL\`, \`ParentId\`, \`IsParent\`, \`Priority\`) VALUES (11, 'YEMEKSEPETI', NULL, NULL, 'NAV.YEMEKSEPETI', 'entegrations/yemeksepeti-entegration', 'ENTEGRATIONS', 0, 0);`);        

       
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (21, 'SHOW_ROLE', NULL, 1, 1);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (22, 'SHOW_USER', NULL, 1, 2);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (23, 'ADD_USER', 'SHOW_USER', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (24, 'DELETE_USER', 'SHOW_USER', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (25, 'UPDATE_USER', 'SHOW_USER', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (26, 'ADD_ROLE', 'SHOW_ROLE', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (27, 'DELETE_ROLE', 'SHOW_ROLE', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (28, 'UPDATE_ROLE', 'SHOW_ROLE', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (29, 'UPATE_PERMESSIONS', 'SHOW_ROLE', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (30, 'SHOW_CATEGORY', NULL, 1, 5);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (31, 'ADD_CATEGORY', 'SHOW_CATEGORY', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (32, 'UPDATE_CATEGORY', 'SHOW_CATEGORY', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (33, 'DELETE_CATEGORY', 'SHOW_CATEGORY', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (34, 'SHOW_PRODUCT', NULL, 1, 6);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (35, 'ADD_PRODUCT', 'SHOW_PRODUCT', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (36, 'UPDATE_PRODUCT', 'SHOW_PRODUCT', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (37, 'DELETE_PRODUCT', 'SHOW_PRODUCT', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (38, 'SHOW_ORDER', NULL, 1, 7);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (39, 'ADD_ORDER', 'SHOW_ORDER', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (40, 'UPDATE_ORDER', 'SHOW_ORDER', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (41, 'DELETE_ORDER', 'SHOW_ORDER', 0, NULL);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (42, 'SHOW_GETIR_ENTEGRATION', NULL, 1, 10);`);
       await queryRunner.query(`INSERT INTO \`permession\` (\`Id\`, \`PermessionKey\`, \`ParentKey\`, \`IsParent\`, \`menuId\`) VALUES (43, 'SHOW_YEMEK_SEPETI_ENTEGRATION', NULL, 1, 11);`);

       await queryRunner.query(`INSERT INTO \`role\` (\`Id\`, \`RoleName\`, \`Description\`) VALUES (1, 'admin', 'Her şeyi kontrol eder.');`);
       await queryRunner.query(`INSERT INTO \`user\` (\`Id\`, \`UserName\`, \`UserStatus\`, \`Password\`, \`ImagePath\`, \`Email\`, \`Cellphone\`, \`LastSuccesfulLoginDate\`, \`Salt\`, \`Name\`, \`LastName\`, \`roleId\`, \`merchantId\`) VALUES (1, 'fuat', 1, '$2b$10$OdaBo//bG2zmWqCq5rJ6QexvWOSWEoHNcZEGlVUEevzRYgTld8ne.', NULL, 'mfuatnuroglu@gmail.com', '5394679794', '2021-08-07 13:05:47', '$2b$10$OdaBo//bG2zmWqCq5rJ6Qe', 'M Fuat', 'NUROGLU', 1, 1);`);
       await queryRunner.query(`INSERT INTO \`user\` (\`Id\`, \`UserName\`, \`UserStatus\`, \`Password\`, \`ImagePath\`, \`Email\`, \`Cellphone\`, \`LastSuccesfulLoginDate\`, \`Salt\`, \`Name\`, \`LastName\`, \`roleId\`, \`merchantId\`) VALUES (3, 'fuat', 1, '$2b$10$OdaBo//bG2zmWqCq5rJ6QexvWOSWEoHNcZEGlVUEevzRYgTld8ne.', NULL, 'mfuatnuroglu@gmail.com', '5394679794', '2021-08-07 13:05:47', '$2b$10$OdaBo//bG2zmWqCq5rJ6Qe', 'M Fuat', 'NUROGLU', 1, 1);`);


       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (1, 21, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (2, 22, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (3, 23, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (4, 24, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (5, 25, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (6, 26, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (7, 27, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (8, 28, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (9, 29, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (10, 30, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (11, 31, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (12, 32, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (13, 33, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (14, 34, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (15, 35, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (16, 36, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (17, 37, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (18, 38, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (19, 39, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (20, 40, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (21, 41, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (22, 42, 1);`);
       await queryRunner.query(`INSERT INTO \`role_and_permession\` (\`Id\`, \`permessionId\`, \`roleId\`) VALUES (23, 43, 1);`);
        

       await queryRunner.query(`INSERT INTO \`merchant\` (\`Id\`, \`GetirAppSecretKey\`, \`GetirRestaurantSecretKey\`, \`GetirAccessToken\`, \`GetirTokenLastCreated\`, \`userId\`, \`YSAppSecretKey\`, \`YSRestaurantSecretKey\`, \`botUserName\`, \`botToken\`, \`isActive\`, \`GetirRestaurantId\`) VALUES (1, '4490860edf764e1b7c376683f5d9f7fe26c6d724', 'f00a4c91f48c5adbf54cf4b40844199206a9489f', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN0YXVyYW50S2V5Ijp7Iml2IjoiNjEzNzMwNjE2MTM2NjUzNjY0MzEzNTM0MzIzMjM5Mzk2NjYyNjQzNDM0MzEzMTM3NjMzOTY0MzczOTM0NjI2NCIsImRhdGEiOiJhZDM5NTcwMTI3YmY2MzY4YTgxNmM2Y2UyODkwMGJmOGRjYjgyMTk1NzVjOGIxNmVjMTkxYjAzMjU2N2Q3YWQ2MzE3YjExNWEzNjc5M2JmN2IwMjUzODM5MGIwMDM2YTVhNzY3MDZiODIwOWY1YmNiNDM4YWI1ZjU2MDRkMTVjMmM3MmJlZjVhNDdiMDQ0NDM4MTljOTJlNTQxYzU4Y2Y4In0sInB1YmxpY0tleSI6IjM1NTFkYTAxLTVmY2QtNDA0My04N2I3LWU5MDljMTUxYjgyOCIsImlhdCI6MTY0Mjg2MjM3MiwiZXhwIjoxNjQyODgwMzcyfQ.phIkuqqMnx1ijTwtvV8QXpzO5JH81A23jG38Oc82x8g', '2022-01-22 17:39:33', 1, NULL, NULL, 'SiparisVermeBot', '1572537123:AAHs1SWycLVjjdgwWFkDRrMDegJBLf5rfvs', 1, '607e897e204d6125f81bdfbb');`);
       await queryRunner.query(`INSERT INTO \`merchant\` (\`Id\`, \`GetirAppSecretKey\`, \`GetirRestaurantSecretKey\`, \`GetirAccessToken\`, \`GetirTokenLastCreated\`, \`userId\`, \`YSAppSecretKey\`, \`YSRestaurantSecretKey\`, \`botUserName\`, \`botToken\`, \`isActive\`, \`GetirRestaurantId\`) VALUES (2, '4490860edf764e1b7c376683f5d9f7fe26c6d724', 'f00a4c91f48c5adbf54cf4b40844199206a9489f', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN0YXVyYW50S2V5Ijp7Iml2IjoiNjEzNzMwNjE2MTM2NjUzNjY0MzEzNTM0MzIzMjM5Mzk2NjYyNjQzNDM0MzEzMTM3NjMzOTY0MzczOTM0NjI2NCIsImRhdGEiOiJhZDM5NTcwMTI3YmY2MzY4YTgxNmM2Y2UyODkwMGJmOGRjYjgyMTk1NzVjOGIxNmVjMTkxYjAzMjU2N2Q3YWQ2MzE3YjExNWEzNjc5M2JmN2IwMjUzODM5MGIwMDM2YTVhNzY3MDZiODIwOWY1YmNiNDM4YWI1ZjU2MDRkMTVjMmM3MmJlZjVhNDdiMDQ0NDM4MTljOTJlNTQxYzU4Y2Y4In0sInB1YmxpY0tleSI6ImM5YTcxOWU3LTBhM2YtNDk1MS1iNzE2LTFhYjUwMDY5MTlmZCIsImlhdCI6MTYzNjg5ODIzMCwiZXhwIjoxNjM2OTE2MjMwfQ.lWvlTcaT49fuwXe5HPipls2x69fQMDGoxaZ9iLsdlMY', '2021-11-14 16:57:11', 3, NULL, NULL, 'CorbanaBot', '1485687554:AAFbN5pD2h5hzi9o9eydQjh6l4RcVYTtp5c', 1, '607e897e204d6125f81bdfbb');`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`option\` DROP FOREIGN KEY \`FK_a166d02c05dd6e9ae2368fd8960\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_5f44aa02d1c66d9a916a409fcb2\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_62fcc319202f6ec1f6819e1d5f5\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_ff0c0301a95e517153df97f6812\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_646bf9ece6f45dbe41c203e06e0\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_904370c093ceea4369659a3c810\``);
        await queryRunner.query(`ALTER TABLE \`order_option\` DROP FOREIGN KEY \`FK_2815908b460a63ff2eddfc1157f\``);
        await queryRunner.query(`ALTER TABLE \`order_option\` DROP FOREIGN KEY \`FK_5538b5357ae88e5cbd6e4c02c9c\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_293ad75db4c3b2aa62996c75ad1\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_60c614712f96cf7ca323ada03f5\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_cd7812c96209c5bdd48a6b858b0\``);
        await queryRunner.query(`ALTER TABLE \`customer\` DROP FOREIGN KEY \`FK_23778827c741b8937b565a59293\``);
        await queryRunner.query(`ALTER TABLE \`merchant\` DROP FOREIGN KEY \`FK_4973a7acae8e2f6bfac7a781ceb\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`ALTER TABLE \`role_and_permession\` DROP FOREIGN KEY \`FK_1412db6c43dc5be5c275f10dae7\``);
        await queryRunner.query(`ALTER TABLE \`role_and_permession\` DROP FOREIGN KEY \`FK_be903fdc2a1b747959235bb3558\``);
        await queryRunner.query(`ALTER TABLE \`permession\` DROP FOREIGN KEY \`FK_276b5d6df236e69df2a2fa950e8\``);
        await queryRunner.query(`DROP TABLE \`option\``);
        await queryRunner.query(`DROP TABLE \`option_category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP TABLE \`order_item\``);
        await queryRunner.query(`DROP TABLE \`order_option\``);
        await queryRunner.query(`DROP INDEX \`REL_60c614712f96cf7ca323ada03f\` ON \`order\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`getir_order\``);
        await queryRunner.query(`DROP TABLE \`customer\``);
        await queryRunner.query(`DROP INDEX \`REL_4973a7acae8e2f6bfac7a781ce\` ON \`merchant\``);
        await queryRunner.query(`DROP TABLE \`merchant\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP TABLE \`role_and_permession\``);
        await queryRunner.query(`DROP INDEX \`REL_276b5d6df236e69df2a2fa950e\` ON \`permession\``);
        await queryRunner.query(`DROP TABLE \`permession\``);
        await queryRunner.query(`DROP TABLE \`menu\``);
    }
};
