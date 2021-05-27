const up =
    'CREATE TABLE `users` ( ' +
    '  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, ' +
    '  `uuid` VARCHAR(50) NOT NULL, ' +
    '  `name` VARCHAR(50) NOT NULL, ' +
    '  `email` VARCHAR(50) NOT NULL, ' +
    '  `mobile` VARCHAR(11) NOT NULL, ' +
    '  `password` TEXT NOT NULL, ' +
    '  `log_attempts` BOOLEAN NOT NULL DEFAULT 0, ' +
    '  `locked_until` DATETIME NULL, ' +
    '  `email_verified_at` DATETIME NOT NULL DEFAULT NOW(),  ' +
    '  `mobile_verified_at` DATETIME NOT NULL DEFAULT NOW(),  ' +
    '  `created_at` DATETIME NOT NULL DEFAULT NOW(),  ' +
    '  `updated_at` DATETIME NOT NULL DEFAULT NOW(), ' +
    '  `deleted_at` DATETIME NULL, ' +
    '  PRIMARY KEY (`id`), ' +
    '  UNIQUE INDEX `email` (`email` ASC), ' +
    '  UNIQUE INDEX `mobile` (`mobile` ASC), ' +
    '  UNIQUE INDEX `uuid_UNIQUE` (`uuid` ASC));';

const down = 'DROP TABLE `users`;';

module.exports = {
    up,
    down,
}
