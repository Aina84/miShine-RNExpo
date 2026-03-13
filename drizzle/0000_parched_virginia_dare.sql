CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`icon` text NOT NULL,
	`text` text NOT NULL,
	`time` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `finances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text,
	`category` text,
	`name` text,
	`amount` integer,
	`date` text,
	`icon` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `rapports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`type` text,
	`description` text,
	`date` text,
	`offering` text,
	`dim` integer DEFAULT 0,
	`present` integer DEFAULT 0,
	`news` integer DEFAULT 0,
	`auteur` text
);
--> statement-breakpoint
CREATE TABLE `sheeps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`adress` text NOT NULL,
	`description` text NOT NULL,
	`role` text,
	`sexe` text,
	`status` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);