CREATE TABLE `creativeConcepts` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`synopsis` text,
	`keyMessage` text,
	`tone` varchar(255),
	`style` varchar(255),
	`musicType` varchar(255),
	`musicDescription` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creativeConcepts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `equipment` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100),
	`description` text,
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `equipment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locationImages` (
	`id` varchar(64) NOT NULL,
	`locationId` varchar(64) NOT NULL,
	`imageUrl` text NOT NULL,
	`s3Key` varchar(500),
	`caption` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `locationImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`description` text,
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moodboardImages` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`imageUrl` text NOT NULL,
	`s3Key` varchar(500),
	`description` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `moodboardImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectNotes` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`title` varchar(255),
	`content` text,
	`category` varchar(100),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`clientName` varchar(255),
	`projectObjective` text,
	`targetAudience` varchar(255),
	`estimatedDuration` varchar(100),
	`diffusionFormat` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sceneImages` (
	`id` varchar(64) NOT NULL,
	`sceneId` varchar(64) NOT NULL,
	`imageUrl` text NOT NULL,
	`s3Key` varchar(500),
	`caption` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `sceneImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scenes` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`sceneNumber` int NOT NULL,
	`title` varchar(255),
	`description` text,
	`actions` text,
	`dialogue` text,
	`voiceOver` text,
	`duration` varchar(50),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scenes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `talentImages` (
	`id` varchar(64) NOT NULL,
	`talentId` varchar(64) NOT NULL,
	`imageUrl` text NOT NULL,
	`s3Key` varchar(500),
	`caption` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `talentImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `talents` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(255),
	`description` text,
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `talents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teamMembers` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL,
	`email` varchar(255),
	`phone` varchar(20),
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teamMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timeline` (
	`id` varchar(64) NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`phaseName` varchar(255) NOT NULL,
	`description` text,
	`startDate` timestamp,
	`endDate` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timeline_id` PRIMARY KEY(`id`)
);
