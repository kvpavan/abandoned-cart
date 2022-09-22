create schema abandoned_cart;

CREATE TABLE `abandoned_cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` varchar(128) DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `triggered` varchar(512) DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `user.uuid` (`uuid`)
);