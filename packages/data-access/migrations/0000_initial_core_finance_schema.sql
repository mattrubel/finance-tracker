CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`parent_category_id` text,
	`attributes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `merchant_category_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`merchant_id` text NOT NULL,
	`category_id` text NOT NULL,
	`source` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`notes` text,
	`attributes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`merchant_id`) REFERENCES `merchants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "merchant_category_preferences_source_check" CHECK("merchant_category_preferences"."source" in ('user', 'system'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `merchant_active_category_pref_unique` ON `merchant_category_preferences` (`merchant_id`) WHERE "merchant_category_preferences"."is_active" = 1;--> statement-breakpoint
CREATE INDEX `merchant_category_preferences_merchant_idx` ON `merchant_category_preferences` (`merchant_id`);--> statement-breakpoint
CREATE INDEX `merchant_category_preferences_category_idx` ON `merchant_category_preferences` (`category_id`);--> statement-breakpoint
CREATE TABLE `merchants` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`normalized_name` text NOT NULL,
	`attributes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `merchants_normalized_name_unique` ON `merchants` (`normalized_name`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`external_id` text,
	`date` text NOT NULL,
	`description` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text NOT NULL,
	`account_name` text NOT NULL,
	`account_id` text,
	`merchant` text,
	`merchant_id` text,
	`category` text,
	`category_id` text,
	`type` text,
	`attributes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`merchant_id`) REFERENCES `merchants`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `transactions_date_idx` ON `transactions` (`date`);--> statement-breakpoint
CREATE INDEX `transactions_merchant_idx` ON `transactions` (`merchant_id`);--> statement-breakpoint
CREATE INDEX `transactions_category_idx` ON `transactions` (`category_id`);--> statement-breakpoint
CREATE INDEX `transactions_account_name_idx` ON `transactions` (`account_name`);