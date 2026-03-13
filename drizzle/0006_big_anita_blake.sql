CREATE TABLE `finances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`name` text NOT NULL,
	`amount` integer NOT NULL,
	`date` text NOT NULL,
	`icon` text NOT NULL,
	`created_at` integer
);
DROP TABLE `reports`;