CREATE TABLE `import_batches` (
	`id` text PRIMARY KEY NOT NULL,
	`source_type` text NOT NULL,
	`source_filename` text,
	`imported_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`total_rows` integer NOT NULL,
	`accepted_rows` integer NOT NULL,
	`rejected_rows` integer NOT NULL,
	`attributes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "import_batches_source_type_check" CHECK("import_batches"."source_type" in ('csv', 'statement', 'api'))
);
--> statement-breakpoint
CREATE INDEX `import_batches_imported_at_idx` ON `import_batches` (`imported_at`);--> statement-breakpoint
CREATE INDEX `import_batches_source_type_idx` ON `import_batches` (`source_type`);--> statement-breakpoint
CREATE TABLE `import_errors` (
	`id` text PRIMARY KEY NOT NULL,
	`batch_id` text NOT NULL,
	`row_number` integer NOT NULL,
	`reason` text NOT NULL,
	`raw_data` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`batch_id`) REFERENCES `import_batches`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `import_errors_batch_idx` ON `import_errors` (`batch_id`);--> statement-breakpoint
CREATE INDEX `import_errors_row_number_idx` ON `import_errors` (`row_number`);--> statement-breakpoint
ALTER TABLE `transactions` ADD `import_batch_id` text REFERENCES import_batches(id);--> statement-breakpoint
CREATE INDEX `transactions_import_batch_idx` ON `transactions` (`import_batch_id`);