const {MigrationInterface, QueryRunner} = require('typeorm');

module.exports = class dbSeed20240508220500 {
  // please create new db before starting the app.
  async up(queryRunner) {

    await queryRunner.query(`
    INSERT INTO \`role\` (\`id\`, \`role_name\`, \`description\`) VALUES (1, 'admin', 'Her şeyi kontrol eder.');
    `);
    

    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (21, 'SHOW_ROLE', NULL, 1);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (22, 'SHOW_USER', 'SHOW_ADMIN_MENUS', 1);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (23, 'ADD_USER', 'SHOW_USER', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (24, 'DELETE_USER', 'SHOW_USER', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (25, 'UPDATE_USER', 'SHOW_USER', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (26, 'ADD_ROLE', 'SHOW_ADMIN_MENUS', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (27, 'DELETE_ROLE', 'SHOW_ROLE', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (28, 'UPDATE_ROLE', 'SHOW_ROLE', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (29, 'UPATE_PERMISSIONS', 'SHOW_ROLE', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (30, 'SHOW_CATEGORY', 'SHOW_PRODUCTS_MANAGEMENT_MENUS', 1);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (31, 'ADD_CATEGORY', 'SHOW_CATEGORY', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (32, 'UPDATE_CATEGORY', 'SHOW_CATEGORY', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (33, 'DELETE_CATEGORY', 'SHOW_CATEGORY', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (34, 'SHOW_PRODUCT', 'SHOW_PRODUCTS_MANAGEMENT_MENUS', 1);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (35, 'ADD_PRODUCT', 'SHOW_PRODUCT', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (36, 'UPDATE_PRODUCT', 'SHOW_PRODUCT', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (37, 'DELETE_PRODUCT', 'SHOW_PRODUCT', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (38, 'SHOW_ORDER', NULL, 1);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (39, 'ADD_ORDER', 'SHOW_ORDER', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (40, 'UPDATE_ORDER', 'SHOW_ORDER', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (41, 'DELETE_ORDER', 'SHOW_ORDER', 0);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (44, 'SHOW_DASHBOARD', NULL, 1);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (45, 'SHOW_ADMIN_MENUS', NULL, 1);`);
    await queryRunner.query(`INSERT INTO \`permission\` (\`id\`, \`permission_key\`, \`parent_key\`, \`is_parent\`) VALUES (46, 'SHOW_PRODUCTS_MANAGEMENT_MENUS', NULL, 1);`);


    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (1, 21, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (2, 22, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (3, 23, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (4, 24, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (5, 25, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (6, 26, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (7, 27, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (8, 28, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (9, 29, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (10, 30, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (11, 31, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (12, 32, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (13, 33, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (14, 34, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (15, 35, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (16, 36, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (17, 37, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (18, 38, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (19, 39, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (20, 40, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (21, 41, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (24, 44, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (25, 45, 1);`);
    await queryRunner.query(`INSERT INTO \`role_and_permission\` (\`id\`, \`permission_id\`, \`role_id\`) VALUES (26, 46, 1);`);



    await queryRunner.query(`INSERT INTO \`menu\` (\`id\`, \`menu_key\`, \`icon\`, \`title\`, \`translate\`, \`url\`, \`parent_id\`, \`is_parent\`, \`priority\`, \`enabled\`, \`role\`) VALUES (2, 'USER_MANAGEMENT', 'card', NULL, 'NAV.USER_MANAGEMENT', '/usermanagement', 'ADMIN_MENUS', 0, 0, 1, 'SHOW_USER');`);
    await queryRunner.query(`INSERT INTO \`menu\` (\`id\`, \`menu_key\`, \`icon\`, \`title\`, \`translate\`, \`url\`, \`parent_id\`, \`is_parent\`, \`priority\`, \`enabled\`, \`role\`) VALUES (3, 'ADMIN_MENUS', 'user', NULL, 'NAV.ADMIN_MENUS', NULL, NULL, 1, 3, 1, 'SHOW_ADMIN_MENUS');`);
    await queryRunner.query(`INSERT INTO \`menu\` (\`id\`, \`menu_key\`, \`icon\`, \`title\`, \`translate\`, \`url\`, \`parent_id\`, \`is_parent\`, \`priority\`, \`enabled\`, \`role\`) VALUES (4, 'PRODUCTS_MANAGEMENT', 'fa-solid fa-box', NULL, 'NAV.PRODUCTS_MANAGEMENT', NULL, NULL, 1, 4, 1, 'SHOW_PRODUCTS_MANAGEMENT_MENUS');`);
    await queryRunner.query(`INSERT INTO \`menu\` (\`id\`, \`menu_key\`, \`icon\`, \`title\`, \`translate\`, \`url\`, \`parent_id\`, \`is_parent\`, \`priority\`, \`enabled\`, \`role\`) VALUES (5, 'CATEGORIES', 'fa-solid fa-list', NULL, 'NAV.CATEGORIES', '/categories', 'PRODUCTS_MANAGEMENT', 0, 0, 1, 'SHOW_CATEGORY');`);
    await queryRunner.query(`INSERT INTO \`menu\` (\`id\`, \`menu_key\`, \`icon\`, \`title\`, \`translate\`, \`url\`, \`parent_id\`, \`is_parent\`, \`priority\`, \`enabled\`, \`role\`) VALUES (6, 'PRODUCTS', 'fa-solid fa-blender', NULL, 'NAV.PRODUCTS', '/products', 'PRODUCTS_MANAGEMENT', 0, 0, 1, 'SHOW_PRODUCT');`);
    await queryRunner.query(`INSERT INTO \`menu\` (\`id\`, \`menu_key\`, \`icon\`, \`title\`, \`translate\`, \`url\`, \`parent_id\`, \`is_parent\`, \`priority\`, \`enabled\`, \`role\`) VALUES (7, 'ORDERS', 'cart', NULL, 'NAV.ORDERS', '/orders', NULL, 0, 2, 1, 'SHOW_ORDER');`);
    await queryRunner.query(`INSERT INTO \`menu\` (\`id\`, \`menu_key\`, \`icon\`, \`title\`, \`translate\`, \`url\`, \`parent_id\`, \`is_parent\`, \`priority\`, \`enabled\`, \`role\`) VALUES (12, 'DASHBOARD', 'home', NULL, 'NAV.DASHBOARD', '/home', NULL, 0, 1, 1, 'SHOW_DASHBOARD');`);
    await queryRunner.query(`INSERT INTO \`menu\` (\`id\`, \`menu_key\`, \`icon\`, \`title\`, \`translate\`, \`url\`, \`parent_id\`, \`is_parent\`, \`priority\`, \`enabled\`, \`role\`) VALUES (15, 'ROLE_MANAGEMENT', 'fa-solid fa-user-gear', NULL, 'NAV.ROLE_MANAGEMENT', '/rolemanagement', 'ADMIN_MENUS', 0, 0, 1, 'SHOW_ROLE');`);


    await queryRunner.query(`INSERT INTO \`merchant\` (\`id\`, \`bot_user_name\`, \`bot_token\`, \`is_active\`, \`getir_app_secret_key\`, \`getir_restaurant_secret_key\`, \`getir_access_token\`, \`getir_token_last_created\`, \`getir_restaurant_id\`, \`ys_app_secret_key\`, \`ys_restaurant_secret_key\`) VALUES (1, 'SiparisVermeBot', NULL, 1, NULL, NULL, NULL, '2022-01-22 17:39:33', NULL, NULL, NULL);`);
    await queryRunner.query(`INSERT INTO \`merchant\` (\`id\`, \`bot_user_name\`, \`bot_token\`, \`is_active\`, \`getir_app_secret_key\`, \`getir_restaurant_secret_key\`, \`getir_access_token\`, \`getir_token_last_created\`, \`getir_restaurant_id\`, \`ys_app_secret_key\`, \`ys_restaurant_secret_key\`) VALUES (2, 'CorbanaBot', NULL, 1, NULL, NULL, NULL, '2021-11-14 16:57:11', NULL, NULL, NULL);`);
   


    await queryRunner.query(`INSERT INTO \`user\` (\`id\`, \`user_name\`, \`user_status\`, \`password\`, \`image_path\`, \`email\`, \`cellphone\`, \`last_succesful_login_date\`, \`salt\`, \`name\`, \`last_name\`, \`role_id\`, \`merchant_id\`) VALUES (1, 'fuat', 1, '$2b$10$OdaBo//bG2zmWqCq5rJ6QexvWOSWEoHNcZEGlVUEevzRYgTld8ne.', NULL, 'mfuatnuroglu@gmail.com', '5394679794', '2021-08-07 13:05:47', '$2b$10$OdaBo//bG2zmWqCq5rJ6Qe', 'M Fuat', 'NUROGLU', 1, 1);`);
    await queryRunner.query(`INSERT INTO \`user\` (\`id\`, \`user_name\`, \`user_status\`, \`password\`, \`image_path\`, \`email\`, \`cellphone\`, \`last_succesful_login_date\`, \`salt\`, \`name\`, \`last_name\`, \`role_id\`, \`merchant_id\`) VALUES (2, 'corbana', 1, '$2b$10$OdaBo//bG2zmWqCq5rJ6QexvWOSWEoHNcZEGlVUEevzRYgTld8ne.', NULL, NULL, NULL, '2021-08-07 13:05:47', '$2b$10$OdaBo//bG2zmWqCq5rJ6Qe', 'corbana', 'corbana', 1, 2);`);
    
  }

  async down(queryRunner) {
  }

};