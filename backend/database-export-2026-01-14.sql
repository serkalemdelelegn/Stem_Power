-- Database Export
-- Generated: 2026-01-14T10:36:41.948Z
-- Database: stem_power

SET FOREIGN_KEY_CHECKS=0;

-- Table: about_stem_centers
DROP TABLE IF EXISTS `about_stem_centers`;
CREATE TABLE `about_stem_centers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(255) DEFAULT 'About STEMpower Ethiopia',
  `title` varchar(255) DEFAULT 'Inside Every Child is a Scientist',
  `description` text,
  `image` varchar(500) DEFAULT NULL,
  `statistic` varchar(50) DEFAULT '61',
  `whoWeAre` json DEFAULT NULL,
  `mission` text,
  `vision` text,
  `values` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: announcements
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `media_url` varchar(500) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `category` varchar(100) DEFAULT NULL COMMENT 'Announcement category (e.g., ''Program Update'', ''Job Opening'', ''Event Announcement'')',
  `type` enum('update','opportunity','event') DEFAULT 'update' COMMENT 'Type of announcement: update, opportunity, or event',
  `location` varchar(255) DEFAULT NULL COMMENT 'Location for event announcements',
  `excerpt` text COMMENT 'Short excerpt/summary of the announcement',
  `deadline` datetime DEFAULT NULL COMMENT 'Application or registration deadline',
  `link` varchar(500) DEFAULT NULL COMMENT 'External link related to the announcement',
  `googleFormUrl` varchar(500) DEFAULT NULL COMMENT 'Google Form URL for applications or registrations',
  `eventId` int DEFAULT NULL COMMENT 'Reference to related event ID',
  `featured` tinyint(1) DEFAULT '0' COMMENT 'Whether this announcement is featured',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: announcements_heroes
DROP TABLE IF EXISTS `announcements_heroes`;
CREATE TABLE `announcements_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(255) NOT NULL DEFAULT 'Stay Informed',
  `title` varchar(255) NOT NULL DEFAULT 'Announcements & Opportunities',
  `description` text,
  `activeAnnouncements` varchar(50) DEFAULT '25+' COMMENT 'Number of active announcements (e.g., ''25+'')',
  `openOpportunities` varchar(50) DEFAULT '10+' COMMENT 'Number of open opportunities (e.g., ''10+'')',
  `upcomingEvents` varchar(50) DEFAULT '5+' COMMENT 'Number of upcoming events (e.g., ''5+'')',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: business_development_service_items
DROP TABLE IF EXISTS `business_development_service_items`;
CREATE TABLE `business_development_service_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(100) DEFAULT NULL COMMENT 'Icon name from lucide-react (e.g., ''target'', ''book-open'', ''users'', ''line-chart'', ''trending-up'', ''handshake'')',
  `capabilities` json DEFAULT NULL COMMENT 'Array of capability strings',
  `order` int DEFAULT '0' COMMENT 'Order for display',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `businessDevServiceId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `businessDevServiceId` (`businessDevServiceId`),
  CONSTRAINT `business_development_service_items_ibfk_1` FOREIGN KEY (`businessDevServiceId`) REFERENCES `business_development_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: business_development_services
DROP TABLE IF EXISTS `business_development_services`;
CREATE TABLE `business_development_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(100) NOT NULL DEFAULT 'Business Development',
  `title` varchar(255) NOT NULL DEFAULT 'Business Development Services',
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: business_stats
DROP TABLE IF EXISTS `business_stats`;
CREATE TABLE `business_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `businessDevServiceId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `businessDevServiceId` (`businessDevServiceId`),
  CONSTRAINT `business_stats_ibfk_1` FOREIGN KEY (`businessDevServiceId`) REFERENCES `business_development_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: chatbot_messages
DROP TABLE IF EXISTS `chatbot_messages`;
CREATE TABLE `chatbot_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionId` int NOT NULL,
  `role` enum('system','user','assistant') NOT NULL,
  `content` text NOT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chatbot_messages_session_id` (`sessionId`),
  KEY `chatbot_messages_created_at` (`createdAt`),
  CONSTRAINT `chatbot_messages_ibfk_1` FOREIGN KEY (`sessionId`) REFERENCES `chatbot_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: chatbot_sessions
DROP TABLE IF EXISTS `chatbot_sessions`;
CREATE TABLE `chatbot_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(180) NOT NULL DEFAULT 'New conversation',
  `userId` int DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `lastInteractionAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chatbot_sessions_user_id` (`userId`),
  KEY `chatbot_sessions_last_interaction_at` (`lastInteractionAt`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: consultancy_services
DROP TABLE IF EXISTS `consultancy_services`;
CREATE TABLE `consultancy_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'bookopen' COMMENT 'Icon name from lucide-react (e.g., ''bookopen'', ''wrench'', ''factory'', ''target'')',
  `deliverables` json DEFAULT NULL COMMENT 'Array of deliverable strings',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `trainingConsultancyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingConsultancyId` (`trainingConsultancyId`),
  CONSTRAINT `consultancy_services_ibfk_1` FOREIGN KEY (`trainingConsultancyId`) REFERENCES `training_consultancy` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: contact_offices
DROP TABLE IF EXISTS `contact_offices`;
CREATE TABLE `contact_offices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `country_office` varchar(250) NOT NULL,
  `office_name` varchar(150) DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `postal_code` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longtiude` decimal(11,8) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `map_link` text,
  `website` varchar(500) DEFAULT NULL,
  `office_hours` varchar(200) DEFAULT NULL,
  `mobile` varchar(50) DEFAULT NULL,
  `image` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: digital_skill_heroes
DROP TABLE IF EXISTS `digital_skill_heroes`;
CREATE TABLE `digital_skill_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(100) NOT NULL DEFAULT 'Entrepreneurship & Incubation',
  `title` varchar(255) NOT NULL DEFAULT 'Digital Skills Training',
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: digital_skill_programs
DROP TABLE IF EXISTS `digital_skill_programs`;
CREATE TABLE `digital_skill_programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_title` varchar(255) NOT NULL,
  `about` enum('open','closed') NOT NULL DEFAULT 'open',
  `status` enum('free','paid') NOT NULL DEFAULT 'free',
  `duration` varchar(100) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `description` text,
  `email` varchar(150) NOT NULL,
  `google_form_link` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `digitalSkillTrainingId` int DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `digitalSkillTrainingId` (`digitalSkillTrainingId`),
  CONSTRAINT `digital_skill_programs_ibfk_1` FOREIGN KEY (`digitalSkillTrainingId`) REFERENCES `digital_skill_trainings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: digital_skill_stats
DROP TABLE IF EXISTS `digital_skill_stats`;
CREATE TABLE `digital_skill_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `digitalSkillTrainingId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `digitalSkillTrainingId` (`digitalSkillTrainingId`),
  CONSTRAINT `digital_skill_stats_ibfk_1` FOREIGN KEY (`digitalSkillTrainingId`) REFERENCES `digital_skill_trainings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: digital_skill_trainings
DROP TABLE IF EXISTS `digital_skill_trainings`;
CREATE TABLE `digital_skill_trainings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(100) NOT NULL DEFAULT 'Digital Skills',
  `title` varchar(255) NOT NULL DEFAULT 'Digital Skills Training',
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: dynamic_pages
DROP TABLE IF EXISTS `dynamic_pages`;
CREATE TABLE `dynamic_pages` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `program` varchar(100) DEFAULT NULL,
  `description` text,
  `heroImage` varchar(500) DEFAULT NULL,
  `heroTitle` varchar(255) DEFAULT NULL,
  `heroSubtitle` varchar(255) DEFAULT NULL,
  `heroDescription` text,
  `ctaText` varchar(255) DEFAULT NULL,
  `ctaLink` varchar(500) DEFAULT NULL,
  `sections` json NOT NULL,
  `status` enum('draft','published') DEFAULT 'draft',
  `publishedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: events
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `is_virtual` tinyint(1) DEFAULT '0',
  `event_url` varchar(500) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `category` varchar(100) DEFAULT NULL COMMENT 'Event category (e.g., ''Competition'', ''Workshop'', ''Summit'', ''Bootcamp'', ''Training'', ''Showcase'')',
  `badge` varchar(100) DEFAULT NULL COMMENT 'Event badge or tag',
  `status` enum('upcoming','past') DEFAULT 'upcoming' COMMENT 'Event status: upcoming or past',
  `featured` tinyint(1) DEFAULT '0' COMMENT 'Whether this event is featured',
  `time` varchar(50) DEFAULT NULL COMMENT 'Event time (e.g., ''10:00 AM - 4:00 PM'')',
  `participants` varchar(100) DEFAULT NULL COMMENT 'Number of participants (e.g., ''100+'', ''50-100'')',
  `registrationLink` varchar(500) DEFAULT NULL COMMENT 'URL to registration form',
  `registrationDeadline` varchar(100) DEFAULT NULL COMMENT 'Registration deadline (e.g., ''March 15, 2024'')',
  `fullDescription` text COMMENT 'Full detailed description of the event',
  `highlights` json DEFAULT NULL COMMENT 'Array of event highlights',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: events_heroes
DROP TABLE IF EXISTS `events_heroes`;
CREATE TABLE `events_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(255) NOT NULL DEFAULT 'STEMpower Ethiopia Events',
  `title` varchar(255) NOT NULL DEFAULT 'Join Our STEM Community Events',
  `description` text,
  `image` varchar(500) DEFAULT NULL COMMENT 'Hero image URL or path',
  `stat1Icon` varchar(50) DEFAULT 'calendar' COMMENT 'First statistic icon (e.g., ''calendar'', ''users'', ''star'')',
  `stat1Value` varchar(50) DEFAULT '50+' COMMENT 'First statistic value (e.g., ''50+'')',
  `stat1Label` varchar(100) DEFAULT 'Annual Events' COMMENT 'First statistic label',
  `stat2Icon` varchar(50) DEFAULT 'users' COMMENT 'Second statistic icon',
  `stat2Value` varchar(50) DEFAULT '10,000+' COMMENT 'Second statistic value',
  `stat2Label` varchar(100) DEFAULT 'Participants' COMMENT 'Second statistic label',
  `stat3Icon` varchar(50) DEFAULT 'star' COMMENT 'Third statistic icon',
  `stat3Value` varchar(50) DEFAULT '25+' COMMENT 'Third statistic value',
  `stat3Label` varchar(100) DEFAULT 'Competitions Hosted' COMMENT 'Third statistic label',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: fablab_product_applications
DROP TABLE IF EXISTS `fablab_product_applications`;
CREATE TABLE `fablab_product_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `productId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `fablab_product_applications_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `fablab_products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: fablab_product_features
DROP TABLE IF EXISTS `fablab_product_features`;
CREATE TABLE `fablab_product_features` (
  `id` int NOT NULL AUTO_INCREMENT,
  `feature` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `productId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `fablab_product_features_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `fablab_products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: fablab_product_heroes
DROP TABLE IF EXISTS `fablab_product_heroes`;
CREATE TABLE `fablab_product_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(255) NOT NULL DEFAULT 'Empowering Africa''s Next Generation Since 2010',
  `title` varchar(255) NOT NULL DEFAULT 'Celebrating Excellence',
  `subtitle` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: fablab_product_stats
DROP TABLE IF EXISTS `fablab_product_stats`;
CREATE TABLE `fablab_product_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `heroId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `heroId` (`heroId`),
  CONSTRAINT `fablab_product_stats_ibfk_1` FOREIGN KEY (`heroId`) REFERENCES `fablab_product_heroes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: fablab_products
DROP TABLE IF EXISTS `fablab_products`;
CREATE TABLE `fablab_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `status` enum('in stock','out of stock','coming soon') NOT NULL DEFAULT 'in stock',
  `product_overview` text,
  `whats_included` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `heroId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `heroId` (`heroId`),
  CONSTRAINT `fablab_products_ibfk_1` FOREIGN KEY (`heroId`) REFERENCES `fablab_product_heroes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: fablab_service_applications
DROP TABLE IF EXISTS `fablab_service_applications`;
CREATE TABLE `fablab_service_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `serviceId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `serviceId` (`serviceId`),
  CONSTRAINT `fablab_service_applications_ibfk_1` FOREIGN KEY (`serviceId`) REFERENCES `fablab_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: fablab_service_benefits
DROP TABLE IF EXISTS `fablab_service_benefits`;
CREATE TABLE `fablab_service_benefits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'users' COMMENT 'Icon name from lucide-react (e.g., ''users'', ''shield'', ''graduationcap'', ''lightbulb'')',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `heroId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `heroId` (`heroId`),
  CONSTRAINT `fablab_service_benefits_ibfk_1` FOREIGN KEY (`heroId`) REFERENCES `fablab_service_heroes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: fablab_service_features
DROP TABLE IF EXISTS `fablab_service_features`;
CREATE TABLE `fablab_service_features` (
  `id` int NOT NULL AUTO_INCREMENT,
  `feature` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `serviceId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `serviceId` (`serviceId`),
  CONSTRAINT `fablab_service_features_ibfk_1` FOREIGN KEY (`serviceId`) REFERENCES `fablab_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: fablab_service_heroes
DROP TABLE IF EXISTS `fablab_service_heroes`;
CREATE TABLE `fablab_service_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(255) NOT NULL DEFAULT 'Advanced Tools for Innovation',
  `title` varchar(255) NOT NULL DEFAULT 'FabLab Services',
  `subtitle` text COMMENT 'Legacy field, use description instead',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: fablab_service_stats
DROP TABLE IF EXISTS `fablab_service_stats`;
CREATE TABLE `fablab_service_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `heroId` int DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL COMMENT 'Icon name from lucide-react (e.g., ''factory'', ''lightbulb'', ''users'', ''shield'')',
  PRIMARY KEY (`id`),
  KEY `heroId` (`heroId`),
  CONSTRAINT `fablab_service_stats_ibfk_1` FOREIGN KEY (`heroId`) REFERENCES `fablab_service_heroes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: fablab_services
DROP TABLE IF EXISTS `fablab_services`;
CREATE TABLE `fablab_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `badge_title` varchar(255) DEFAULT NULL,
  `badge_icon` varchar(255) DEFAULT NULL,
  `service_overview` text,
  `whats_included` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `heroId` int DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL COMMENT 'Icon name from lucide-react (e.g., ''printer'', ''zap'', ''cpu'', ''circuitboard'', ''wrench'')',
  `capabilities` json DEFAULT NULL COMMENT 'Array of capability strings',
  `applications` json DEFAULT NULL COMMENT 'Array of application strings',
  `specs` json DEFAULT NULL COMMENT 'Object with spec key-value pairs (e.g., {precision: ''±0.1mm'', materials: ''Multiple''})',
  PRIMARY KEY (`id`),
  KEY `heroId` (`heroId`),
  CONSTRAINT `fablab_services_ibfk_1` FOREIGN KEY (`heroId`) REFERENCES `fablab_service_heroes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: featured_partners
DROP TABLE IF EXISTS `featured_partners`;
CREATE TABLE `featured_partners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `logo_url` varchar(500) NOT NULL,
  `website_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: footer
DROP TABLE IF EXISTS `footer`;
CREATE TABLE `footer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `logo` varchar(500) DEFAULT '/STEMpower_s_logo.png',
  `description` text,
  `copyrightText` varchar(500) DEFAULT NULL,
  `contactEmail` varchar(255) DEFAULT NULL,
  `contactPhone` varchar(100) DEFAULT NULL,
  `contactAddress` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: footer_section_links
DROP TABLE IF EXISTS `footer_section_links`;
CREATE TABLE `footer_section_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(200) NOT NULL,
  `url` varchar(500) NOT NULL,
  `order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `footerSectionId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `footerSectionId` (`footerSectionId`),
  CONSTRAINT `footer_section_links_ibfk_1` FOREIGN KEY (`footerSectionId`) REFERENCES `footer_sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: footer_sections
DROP TABLE IF EXISTS `footer_sections`;
CREATE TABLE `footer_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: footer_social_links
DROP TABLE IF EXISTS `footer_social_links`;
CREATE TABLE `footer_social_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `platform` varchar(100) NOT NULL,
  `url` varchar(500) NOT NULL,
  `order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: funding_partners
DROP TABLE IF EXISTS `funding_partners`;
CREATE TABLE `funding_partners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `contribution_description` text NOT NULL,
  `focus_area` varchar(255) NOT NULL,
  `partnership_duration` varchar(255) DEFAULT NULL,
  `people_impacted` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `businessDevServiceId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `businessDevServiceId` (`businessDevServiceId`),
  CONSTRAINT `funding_partners_ibfk_1` FOREIGN KEY (`businessDevServiceId`) REFERENCES `business_development_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: header_links
DROP TABLE IF EXISTS `header_links`;
CREATE TABLE `header_links` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `label` varchar(255) NOT NULL,
  `url` varchar(500) NOT NULL,
  `order` int DEFAULT '0',
  `children` json NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: hero_sections
DROP TABLE IF EXISTS `hero_sections`;
CREATE TABLE `hero_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `description` text,
  `cta` varchar(255) DEFAULT NULL,
  `ctaSecondary` varchar(255) DEFAULT NULL,
  `stat1Label` varchar(255) DEFAULT NULL,
  `stat1Value` varchar(255) DEFAULT NULL,
  `stat2Label` varchar(255) DEFAULT NULL,
  `stat2Value` varchar(255) DEFAULT NULL,
  `stat3Label` varchar(255) DEFAULT NULL,
  `stat3Value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: impact_dashboard
DROP TABLE IF EXISTS `impact_dashboard`;
CREATE TABLE `impact_dashboard` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_participation` int NOT NULL DEFAULT '0',
  `stem_centers` int NOT NULL DEFAULT '0',
  `events_held` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: impact_stats
DROP TABLE IF EXISTS `impact_stats`;
CREATE TABLE `impact_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `impact_id` int NOT NULL,
  `metric_key` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `icon` varchar(255) DEFAULT NULL,
  `progress` int DEFAULT '0',
  `trend` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `value` int DEFAULT '0',
  `display_value` varchar(255) DEFAULT NULL,
  `is_extra` tinyint(1) DEFAULT '0',
  `sort_order` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `impact_id` (`impact_id`),
  CONSTRAINT `impact_stats_ibfk_1` FOREIGN KEY (`impact_id`) REFERENCES `impact_dashboard` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: incubation_courses
DROP TABLE IF EXISTS `incubation_courses`;
CREATE TABLE `incubation_courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_title` varchar(255) NOT NULL,
  `about` enum('open','closed') NOT NULL DEFAULT 'open',
  `status` enum('free','paid') NOT NULL DEFAULT 'free',
  `duration` varchar(100) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `description` text,
  `email` varchar(150) NOT NULL,
  `google_form_link` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `incubationProgramId` int DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `incubationProgramId` (`incubationProgramId`),
  CONSTRAINT `incubation_courses_ibfk_1` FOREIGN KEY (`incubationProgramId`) REFERENCES `incubation_programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: incubation_heroes
DROP TABLE IF EXISTS `incubation_heroes`;
CREATE TABLE `incubation_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(100) NOT NULL DEFAULT 'Entrepreneurship & Incubation',
  `title` varchar(255) NOT NULL DEFAULT 'Incubation Program',
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: incubation_programs
DROP TABLE IF EXISTS `incubation_programs`;
CREATE TABLE `incubation_programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(100) NOT NULL DEFAULT 'Incubation Program',
  `title` varchar(255) NOT NULL DEFAULT 'Incubation Program',
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: incubation_stats
DROP TABLE IF EXISTS `incubation_stats`;
CREATE TABLE `incubation_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `incubationProgramId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `incubationProgramId` (`incubationProgramId`),
  CONSTRAINT `incubation_stats_ibfk_1` FOREIGN KEY (`incubationProgramId`) REFERENCES `incubation_programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: incubation_success_stories
DROP TABLE IF EXISTS `incubation_success_stories`;
CREATE TABLE `incubation_success_stories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `business_name` varchar(255) NOT NULL,
  `license_status` varchar(100) DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  `category_color` varchar(50) DEFAULT NULL,
  `contact_person` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `icon` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `incubationProgramId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `incubationProgramId` (`incubationProgramId`),
  CONSTRAINT `incubation_success_stories_ibfk_1` FOREIGN KEY (`incubationProgramId`) REFERENCES `incubation_programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: maker_space_features
DROP TABLE IF EXISTS `maker_space_features`;
CREATE TABLE `maker_space_features` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'sparkles' COMMENT 'Icon name from lucide-react (e.g., ''printer'', ''cpu'', ''palette'', ''users-round'')',
  `image` varchar(500) NOT NULL,
  `category` varchar(100) DEFAULT NULL COMMENT 'Optional category for grouping features',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `makerSpaceId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `makerSpaceId` (`makerSpaceId`),
  CONSTRAINT `maker_space_features_ibfk_1` FOREIGN KEY (`makerSpaceId`) REFERENCES `maker_spaces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: maker_space_gallery
DROP TABLE IF EXISTS `maker_space_gallery`;
CREATE TABLE `maker_space_gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(500) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `makerSpaceId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `makerSpaceId` (`makerSpaceId`),
  CONSTRAINT `maker_space_gallery_ibfk_1` FOREIGN KEY (`makerSpaceId`) REFERENCES `maker_spaces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: maker_space_heroes
DROP TABLE IF EXISTS `maker_space_heroes`;
CREATE TABLE `maker_space_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(255) NOT NULL DEFAULT 'FabLab Program',
  `title` varchar(255) NOT NULL DEFAULT 'Dream. Build. Discover.',
  `description` text,
  `image` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: maker_space_stats
DROP TABLE IF EXISTS `maker_space_stats`;
CREATE TABLE `maker_space_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `makerSpaceId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `makerSpaceId` (`makerSpaceId`),
  CONSTRAINT `maker_space_stats_ibfk_1` FOREIGN KEY (`makerSpaceId`) REFERENCES `maker_spaces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: maker_space_workshops
DROP TABLE IF EXISTS `maker_space_workshops`;
CREATE TABLE `maker_space_workshops` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `title` varchar(255) NOT NULL,
  `level` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
  `duration` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text,
  `registration_link` varchar(500) DEFAULT NULL,
  `workshop_image` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `makerSpaceId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `makerSpaceId` (`makerSpaceId`),
  CONSTRAINT `maker_space_workshops_ibfk_1` FOREIGN KEY (`makerSpaceId`) REFERENCES `maker_spaces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: maker_spaces
DROP TABLE IF EXISTS `maker_spaces`;
CREATE TABLE `maker_spaces` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(100) NOT NULL DEFAULT 'FabLab Program',
  `title` varchar(255) NOT NULL DEFAULT 'Maker Space: Dream. Build. Discover.',
  `subtitle` text NOT NULL,
  `hero_image` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: members
DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `role` varchar(150) NOT NULL,
  `bio` text,
  `photo_url` varchar(500) DEFAULT NULL,
  `type` enum('board','staff') NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: news
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `source` enum('newsletter','press','social') NOT NULL,
  `views` int DEFAULT '0',
  `commentCount` int DEFAULT '0',
  `likeCount` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `slug` varchar(255) DEFAULT NULL COMMENT 'URL-friendly slug for newsletter',
  `excerpt` text COMMENT 'Short description/excerpt for newsletter',
  `category` varchar(100) DEFAULT NULL COMMENT 'Category for newsletter (e.g., ''Updates'', ''Events'', ''Impact'')',
  `date` datetime DEFAULT NULL COMMENT 'Publication date for newsletter',
  `readTime` varchar(50) DEFAULT NULL COMMENT 'Estimated read time (e.g., ''5 min read'')',
  `pdfUrl` varchar(500) DEFAULT NULL COMMENT 'URL to PDF version of newsletter',
  `featured` tinyint(1) DEFAULT '0' COMMENT 'Whether this newsletter is featured',
  `author` varchar(255) DEFAULT NULL COMMENT 'Author name',
  `platform` enum('Facebook','LinkedIn','Twitter','Instagram') DEFAULT NULL COMMENT 'Social media platform for social source posts',
  `link` varchar(500) DEFAULT NULL COMMENT 'URL to original social media post',
  `shares` int DEFAULT '0' COMMENT 'Number of shares for social media posts',
  `publication` varchar(255) DEFAULT NULL COMMENT 'Publication name for press articles (e.g., ''Ethiopian Herald'', ''Addis Standard'')',
  `publicationType` varchar(100) DEFAULT NULL COMMENT 'Type of publication (e.g., ''Newspaper'', ''Online Magazine'', ''Blog'')',
  `quote` text COMMENT 'Featured quote from the press article',
  `topic` varchar(255) DEFAULT NULL COMMENT 'Topic or theme of the press article',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`),
  UNIQUE KEY `slug_16` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: news_comments
DROP TABLE IF EXISTS `news_comments`;
CREATE TABLE `news_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment` text NOT NULL,
  `userId` int NOT NULL,
  `newsId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `newsId` (`newsId`),
  CONSTRAINT `news_comments_ibfk_47` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `news_comments_ibfk_48` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: news_likes
DROP TABLE IF EXISTS `news_likes`;
CREATE TABLE `news_likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `newsId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `news_likes_user_id_news_id` (`userId`,`newsId`),
  KEY `newsId` (`newsId`),
  CONSTRAINT `news_likes_ibfk_45` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `news_likes_ibfk_46` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: newsletter_heroes
DROP TABLE IF EXISTS `newsletter_heroes`;
CREATE TABLE `newsletter_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(255) NOT NULL DEFAULT 'STEMpower Newsletters',
  `title` varchar(255) NOT NULL DEFAULT 'Stay Connected',
  `description` text,
  `subscribers` varchar(50) DEFAULT '5,000+' COMMENT 'Number of subscribers (e.g., ''5,000+'')',
  `newsletters` varchar(50) DEFAULT '48+' COMMENT 'Number of newsletters (e.g., ''48+'')',
  `monthlyReaders` varchar(50) DEFAULT '12,000+' COMMENT 'Monthly readers (e.g., ''12,000+'')',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: newsletter_subscriber
DROP TABLE IF EXISTS `newsletter_subscriber`;
CREATE TABLE `newsletter_subscriber` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `subscribed_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: partnership_types
DROP TABLE IF EXISTS `partnership_types`;
CREATE TABLE `partnership_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'school' COMMENT 'Icon name from lucide-react (e.g., ''school'', ''building2'', ''factory'')',
  `image` varchar(500) DEFAULT NULL COMMENT 'URL or path to partnership type image',
  `benefits` json DEFAULT NULL COMMENT 'Array of benefit strings',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `trainingConsultancyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingConsultancyId` (`trainingConsultancyId`),
  CONSTRAINT `partnership_types_ibfk_1` FOREIGN KEY (`trainingConsultancyId`) REFERENCES `training_consultancy` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: quick_links
DROP TABLE IF EXISTS `quick_links`;
CREATE TABLE `quick_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `url` varchar(500) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: recognitions
DROP TABLE IF EXISTS `recognitions`;
CREATE TABLE `recognitions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `status` varchar(100) NOT NULL,
  `level_of_recognition` varchar(100) NOT NULL,
  `awarded_by` varchar(255) NOT NULL,
  `prize_amount` varchar(100) DEFAULT NULL,
  `description` text,
  `science_fair_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `science_fair_id` (`science_fair_id`),
  CONSTRAINT `recognitions_ibfk_1` FOREIGN KEY (`science_fair_id`) REFERENCES `science_fairs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: rotating_gallery
DROP TABLE IF EXISTS `rotating_gallery`;
CREATE TABLE `rotating_gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `caption` varchar(500) DEFAULT NULL,
  `media_url` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `participants` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: science_fair_heroes
DROP TABLE IF EXISTS `science_fair_heroes`;
CREATE TABLE `science_fair_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(150) NOT NULL DEFAULT 'STEM Operations',
  `title` varchar(255) NOT NULL DEFAULT 'Innovation Meets Opportunity',
  `subtitle` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: science_fair_journey_stages
DROP TABLE IF EXISTS `science_fair_journey_stages`;
CREATE TABLE `science_fair_journey_stages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `badge` varchar(150) NOT NULL,
  `number` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `order` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: science_fair_stats
DROP TABLE IF EXISTS `science_fair_stats`;
CREATE TABLE `science_fair_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` varchar(100) NOT NULL,
  `label` varchar(255) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: science_fair_winners
DROP TABLE IF EXISTS `science_fair_winners`;
CREATE TABLE `science_fair_winners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectTitle` varchar(255) NOT NULL,
  `studentName` varchar(255) NOT NULL,
  `university` varchar(255) NOT NULL,
  `description` text,
  `placementBadge` varchar(100) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: science_fairs
DROP TABLE IF EXISTS `science_fairs`;
CREATE TABLE `science_fairs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(150) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` text,
  `hero_image` varchar(500) DEFAULT NULL,
  `projects_count` varchar(100) DEFAULT NULL,
  `participants_count` varchar(100) DEFAULT NULL,
  `schools_involved` varchar(100) DEFAULT NULL,
  `awards_given` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: social_links
DROP TABLE IF EXISTS `social_links`;
CREATE TABLE `social_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `platform` varchar(150) NOT NULL,
  `url` varchar(500) NOT NULL,
  `icon` varchar(500) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: social_media_heroes
DROP TABLE IF EXISTS `social_media_heroes`;
CREATE TABLE `social_media_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(255) NOT NULL DEFAULT 'Social Media Updates',
  `title` varchar(255) NOT NULL DEFAULT 'Follow Our Journey on Social Media',
  `description` text,
  `stat1Value` varchar(50) DEFAULT '25K+' COMMENT 'First statistic value (e.g., ''25K+'')',
  `stat1Label` varchar(100) DEFAULT 'Total Followers' COMMENT 'First statistic label',
  `stat2Value` varchar(50) DEFAULT '150K+' COMMENT 'Second statistic value (e.g., ''150K+'')',
  `stat2Label` varchar(100) DEFAULT 'Monthly Reach' COMMENT 'Second statistic label',
  `stat3Value` varchar(50) DEFAULT '8.5%' COMMENT 'Third statistic value (e.g., ''8.5%'')',
  `stat3Label` varchar(100) DEFAULT 'Engagement Rate' COMMENT 'Third statistic label',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: soft_skill_heroes
DROP TABLE IF EXISTS `soft_skill_heroes`;
CREATE TABLE `soft_skill_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(100) NOT NULL DEFAULT 'Entrepreneurship & Incubation',
  `title` varchar(255) NOT NULL DEFAULT 'Soft Skills Training',
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: soft_skill_programs
DROP TABLE IF EXISTS `soft_skill_programs`;
CREATE TABLE `soft_skill_programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_title` varchar(255) NOT NULL,
  `about` enum('open','closed') NOT NULL DEFAULT 'open',
  `status` enum('free','paid') NOT NULL DEFAULT 'free',
  `duration` varchar(100) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `description` text,
  `email` varchar(150) NOT NULL,
  `google_form_link` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `softSkillTrainingId` int DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `softSkillTrainingId` (`softSkillTrainingId`),
  CONSTRAINT `soft_skill_programs_ibfk_1` FOREIGN KEY (`softSkillTrainingId`) REFERENCES `soft_skill_trainings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: soft_skill_stats
DROP TABLE IF EXISTS `soft_skill_stats`;
CREATE TABLE `soft_skill_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `softSkillTrainingId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `softSkillTrainingId` (`softSkillTrainingId`),
  CONSTRAINT `soft_skill_stats_ibfk_1` FOREIGN KEY (`softSkillTrainingId`) REFERENCES `soft_skill_trainings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: soft_skill_trainings
DROP TABLE IF EXISTS `soft_skill_trainings`;
CREATE TABLE `soft_skill_trainings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(100) NOT NULL DEFAULT 'Soft Skills Training',
  `title` varchar(255) NOT NULL DEFAULT 'Soft Skills Training',
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: staff_hero_stats
DROP TABLE IF EXISTS `staff_hero_stats`;
CREATE TABLE `staff_hero_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT 'users',
  `order` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `staff_hero_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `staff_hero_id` (`staff_hero_id`),
  CONSTRAINT `staff_hero_stats_ibfk_1` FOREIGN KEY (`staff_hero_id`) REFERENCES `staff_heroes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: staff_heroes
DROP TABLE IF EXISTS `staff_heroes`;
CREATE TABLE `staff_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(255) NOT NULL DEFAULT 'Meet the Ethiopian Team',
  `title` varchar(255) NOT NULL DEFAULT 'The Heart Behind STEMpower Ethiopia',
  `subtitle` text,
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: stem_center_heroes
DROP TABLE IF EXISTS `stem_center_heroes`;
CREATE TABLE `stem_center_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT 'STEM Centers',
  `subtitle` text,
  `hero_image` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: stem_center_laboratories
DROP TABLE IF EXISTS `stem_center_laboratories`;
CREATE TABLE `stem_center_laboratories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `centerId` int DEFAULT NULL,
  `laboratoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stem_center_laboratories_laboratoryId_centerId_unique` (`centerId`,`laboratoryId`),
  KEY `laboratoryId` (`laboratoryId`),
  CONSTRAINT `stem_center_laboratories_ibfk_31` FOREIGN KEY (`centerId`) REFERENCES `stem_centers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stem_center_laboratories_ibfk_32` FOREIGN KEY (`laboratoryId`) REFERENCES `stem_laboratories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: stem_center_stats
DROP TABLE IF EXISTS `stem_center_stats`;
CREATE TABLE `stem_center_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `heroId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `heroId` (`heroId`),
  CONSTRAINT `stem_center_stats_ibfk_1` FOREIGN KEY (`heroId`) REFERENCES `stem_center_heroes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: stem_centers
DROP TABLE IF EXISTS `stem_centers`;
CREATE TABLE `stem_centers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `established_date` datetime NOT NULL,
  `director_name` varchar(255) NOT NULL,
  `funded_by` varchar(255) DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `heroId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `heroId` (`heroId`),
  CONSTRAINT `stem_centers_ibfk_1` FOREIGN KEY (`heroId`) REFERENCES `stem_center_heroes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: stem_laboratories
DROP TABLE IF EXISTS `stem_laboratories`;
CREATE TABLE `stem_laboratories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `icon` varchar(50) DEFAULT 0xF09F94AC,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: stem_tv
DROP TABLE IF EXISTS `stem_tv`;
CREATE TABLE `stem_tv` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `desctiption` text,
  `youtube_url` varchar(500) NOT NULL,
  `youtube_id` varchar(50) DEFAULT NULL COMMENT 'Extracted YouTube video id',
  `published_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: success_metrics
DROP TABLE IF EXISTS `success_metrics`;
CREATE TABLE `success_metrics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `metric` varchar(100) NOT NULL COMMENT 'The metric value (e.g., ''95%'', ''80%'', ''50+'')',
  `label` varchar(255) NOT NULL COMMENT 'The metric label (e.g., ''Teacher Confidence Increase'')',
  `icon` varchar(100) NOT NULL DEFAULT 'trendingup' COMMENT 'Icon name from lucide-react (e.g., ''trendingup'', ''lightbulb'', ''wrench'', ''bookopen'')',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `trainingConsultancyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingConsultancyId` (`trainingConsultancyId`),
  CONSTRAINT `success_metrics_ibfk_1` FOREIGN KEY (`trainingConsultancyId`) REFERENCES `training_consultancy` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: success_stories
DROP TABLE IF EXISTS `success_stories`;
CREATE TABLE `success_stories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `business_name` varchar(255) NOT NULL,
  `license_status` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `category_color` varchar(20) DEFAULT NULL,
  `contact_person` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `icon` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `businessDevServiceId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `businessDevServiceId` (`businessDevServiceId`),
  CONSTRAINT `success_stories_ibfk_1` FOREIGN KEY (`businessDevServiceId`) REFERENCES `business_development_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: testimonials
DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE `testimonials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `order` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: training_consultancy
DROP TABLE IF EXISTS `training_consultancy`;
CREATE TABLE `training_consultancy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(100) NOT NULL DEFAULT 'FabLab Program',
  `title` varchar(255) NOT NULL DEFAULT 'Training & Consultancy',
  `subtitle` text,
  `hero_image` varchar(500) DEFAULT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `button_link` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: training_consultancy_heroes
DROP TABLE IF EXISTS `training_consultancy_heroes`;
CREATE TABLE `training_consultancy_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(255) NOT NULL DEFAULT 'Building Capacity, Transforming Education',
  `title` varchar(255) NOT NULL DEFAULT 'STEM Training & Consultancy',
  `description` text,
  `image` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: training_consultancy_page_stats
DROP TABLE IF EXISTS `training_consultancy_page_stats`;
CREATE TABLE `training_consultancy_page_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pageId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pageId` (`pageId`),
  CONSTRAINT `training_consultancy_page_stats_ibfk_1` FOREIGN KEY (`pageId`) REFERENCES `training_consultancy_pages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: training_consultancy_pages
DROP TABLE IF EXISTS `training_consultancy_pages`;
CREATE TABLE `training_consultancy_pages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `url` varchar(500) NOT NULL,
  `meta_description` text,
  `hero_title` varchar(255) DEFAULT NULL,
  `hero_subtitle` text,
  `hero_image` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `trainingConsultancyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingConsultancyId` (`trainingConsultancyId`),
  CONSTRAINT `training_consultancy_pages_ibfk_1` FOREIGN KEY (`trainingConsultancyId`) REFERENCES `training_consultancy` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: training_consultancy_partners
DROP TABLE IF EXISTS `training_consultancy_partners`;
CREATE TABLE `training_consultancy_partners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `logo` varchar(500) DEFAULT NULL COMMENT 'URL or path to partner logo image',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `trainingConsultancyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingConsultancyId` (`trainingConsultancyId`),
  CONSTRAINT `training_consultancy_partners_ibfk_1` FOREIGN KEY (`trainingConsultancyId`) REFERENCES `training_consultancy` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: training_consultancy_partners_sections
DROP TABLE IF EXISTS `training_consultancy_partners_sections`;
CREATE TABLE `training_consultancy_partners_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT 'Trusted by partners',
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: training_consultancy_percentage_stats
DROP TABLE IF EXISTS `training_consultancy_percentage_stats`;
CREATE TABLE `training_consultancy_percentage_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `percentage_value` float NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `trainingConsultancyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingConsultancyId` (`trainingConsultancyId`),
  CONSTRAINT `training_consultancy_percentage_stats_ibfk_1` FOREIGN KEY (`trainingConsultancyId`) REFERENCES `training_consultancy` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: training_consultancy_stats
DROP TABLE IF EXISTS `training_consultancy_stats`;
CREATE TABLE `training_consultancy_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `value` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `trainingConsultancyId` int DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL COMMENT 'Icon name from lucide-react (e.g., ''building2'', ''graduationcap'', ''globe'', ''award'')',
  PRIMARY KEY (`id`),
  KEY `trainingConsultancyId` (`trainingConsultancyId`),
  CONSTRAINT `training_consultancy_stats_ibfk_1` FOREIGN KEY (`trainingConsultancyId`) REFERENCES `training_consultancy` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: training_programs
DROP TABLE IF EXISTS `training_programs`;
CREATE TABLE `training_programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'graduationcap' COMMENT 'Icon name from lucide-react (e.g., ''graduationcap'', ''users'', ''building2'')',
  `image` varchar(500) DEFAULT NULL,
  `features` json DEFAULT NULL COMMENT 'Array of feature strings',
  `outcomes` json DEFAULT NULL COMMENT 'Array of outcome strings',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `trainingConsultancyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingConsultancyId` (`trainingConsultancyId`),
  CONSTRAINT `training_programs_ibfk_1` FOREIGN KEY (`trainingConsultancyId`) REFERENCES `training_consultancy` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: universities
DROP TABLE IF EXISTS `universities`;
CREATE TABLE `universities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `university_details` text,
  `key_facilities` text,
  `notable_achievements` text,
  `university_image` varchar(500) DEFAULT NULL,
  `university_outreach_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `established` int DEFAULT NULL,
  `studentsServed` varchar(100) DEFAULT NULL,
  `programStartYear` int DEFAULT NULL,
  `description` text,
  `image` varchar(500) DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL,
  `facilities` json DEFAULT NULL,
  `achievements` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `university_outreach_id` (`university_outreach_id`),
  CONSTRAINT `universities_ibfk_1` FOREIGN KEY (`university_outreach_id`) REFERENCES `university_outreach` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: university_outreach
DROP TABLE IF EXISTS `university_outreach`;
CREATE TABLE `university_outreach` (
  `id` int NOT NULL AUTO_INCREMENT,
  `badge` varchar(150) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` text,
  `hero_image` varchar(500) DEFAULT NULL,
  `students_count` varchar(100) DEFAULT NULL,
  `programs_count` varchar(100) DEFAULT NULL,
  `research_projects` varchar(100) DEFAULT NULL,
  `partners` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: university_outreach_impact_stats
DROP TABLE IF EXISTS `university_outreach_impact_stats`;
CREATE TABLE `university_outreach_impact_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` varchar(100) NOT NULL,
  `label` varchar(255) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `university_outreach_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `university_outreach_id` (`university_outreach_id`),
  CONSTRAINT `university_outreach_impact_stats_ibfk_1` FOREIGN KEY (`university_outreach_id`) REFERENCES `university_outreach` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: university_outreach_program_benefits
DROP TABLE IF EXISTS `university_outreach_program_benefits`;
CREATE TABLE `university_outreach_program_benefits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `order` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `university_outreach_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `university_outreach_id` (`university_outreach_id`),
  CONSTRAINT `university_outreach_program_benefits_ibfk_1` FOREIGN KEY (`university_outreach_id`) REFERENCES `university_outreach` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: university_outreach_timelines
DROP TABLE IF EXISTS `university_outreach_timelines`;
CREATE TABLE `university_outreach_timelines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phase` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `year` varchar(50) NOT NULL,
  `order` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `university_outreach_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `university_outreach_id` (`university_outreach_id`),
  CONSTRAINT `university_outreach_timelines_ibfk_1` FOREIGN KEY (`university_outreach_id`) REFERENCES `university_outreach` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','editor','contributor','user') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `permissions` json DEFAULT NULL COMMENT 'JSON object storing page-specific permissions. null or empty means full access for admin role.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: vision_mission_values
DROP TABLE IF EXISTS `vision_mission_values`;
CREATE TABLE `vision_mission_values` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('vision','mission','value','hero','whoWeAre','ecosystem') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `badge` varchar(255) DEFAULT NULL COMMENT 'Badge text for hero section',
  `description` text COMMENT 'Description text for hero or whoWeAre section',
  `image` varchar(500) DEFAULT NULL COMMENT 'Image URL for hero or whoWeAre section',
  `statistic` varchar(50) DEFAULT NULL COMMENT 'Statistic value (e.g., ''61'' for STEM Centers)',
  `whoWeAreBadge` varchar(255) DEFAULT NULL COMMENT 'Badge for Who We Are section',
  `whoWeAreTitle` varchar(255) DEFAULT NULL COMMENT 'Title for Who We Are section',
  `whoWeAreDescription` text COMMENT 'Description for Who We Are section',
  `whoWeAreImage` varchar(500) DEFAULT NULL COMMENT 'Image URL for Who We Are section',
  `values` text COMMENT 'JSON string array of values with title and description',
  `testimonials` text COMMENT 'JSON string array of testimonials',
  `ecosystem` text COMMENT 'JSON string array of ecosystem steps',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data Export

-- Data for table: about_stem_centers
INSERT INTO `about_stem_centers` (`id`, `badge`, `title`, `description`, `image`, `statistic`, `whoWeAre`, `mission`, `vision`, `values`, `is_active`, `createdAt`, `updatedAt`) VALUES (1, 'Get in Touch', 'Let''s Transform STEM Education Together', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'https://res.cloudinary.com/dzcd8yymv/image/upload/v1766051239/about_stem_center/download.avif', '2+ Years of Impact', '{"badge":"jsabf","image":"","title":"who we aresdfgthj","description":"DB_USER=root\\nDB_PASSWORD=\\nDB_NAME=stem_power\\n\\nJWT_SECRET=kOYCfubq4BeW6DbFUWPCx0YU8hxcO2bd"}', 'sdfghjk', 'asdfghjk', '[{"id":"1ae97cf3-aa06-4f8b-9853-c0093a6832b8","title":"wertyhj","description":"awsedrtfgh"}]', 1, '2025-12-18 09:47:18', '2025-12-18 10:21:09');

-- Data for table: announcements_heroes
INSERT INTO `announcements_heroes` (`id`, `badge`, `title`, `description`, `activeAnnouncements`, `openOpportunities`, `upcomingEvents`, `createdAt`, `updatedAt`) VALUES (1, 'fdsgfhgdjhfkgjkhlj;kwertyuiop[]', 'Announcements & Opportunities', 'Stay up to date with official updates, exciting opportunities, and upcoming events from STEMpower Ethiopia. Be the first to know about new programs, job openings, and partnership announcements.', '8+', '5+', '3+', '2025-12-30 22:08:19', '2025-12-30 22:16:10');

-- Data for table: chatbot_messages
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (1, 1, 'user', 'hey buddy', NULL, '2025-12-30 12:31:30', '2025-12-30 12:31:30');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (2, 1, 'assistant', 'I am here to help with information about our STEM programs, events, and services. Could you share a bit more detail about what you need regarding "hey buddy"?', NULL, '2025-12-30 12:31:30', '2025-12-30 12:31:30');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (3, 1, 'user', 'i want to know about the basic stempower works', NULL, '2025-12-30 12:31:56', '2025-12-30 12:31:56');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (4, 1, 'assistant', 'I am here to help with information about our STEM programs, events, and services. Could you share a bit more detail about what you need regarding "i want to know about the basic stempower works"?', NULL, '2025-12-30 12:31:56', '2025-12-30 12:31:56');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (5, 2, 'user', 'What programs do you offer?', NULL, '2025-12-30 12:37:51', '2025-12-30 12:37:51');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (6, 2, 'assistant', 'I am here to help with information about our STEM programs, events, and services. Could you share a bit more detail about what you need regarding "What programs do you offer?"?', NULL, '2025-12-30 12:37:51', '2025-12-30 12:37:51');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (7, 2, 'user', 'i want to incubate on the stem pwoer', NULL, '2025-12-30 12:38:11', '2025-12-30 12:38:11');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (8, 2, 'assistant', 'I am here to help with information about our STEM programs, events, and services. Could you share a bit more detail about what you need regarding "i want to incubate on the stem pwoer"?', NULL, '2025-12-30 12:38:11', '2025-12-30 12:38:11');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (9, 3, 'user', 'i want to know about the basic stempower works', NULL, '2025-12-30 12:43:09', '2025-12-30 12:43:09');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (10, 3, 'assistant', 'STEMpower Ethiopia is an organization dedicated to promoting STEM (Science, Technology, Engineering, and Mathematics) education in Ethiopia.

**Let''s Transform STEM Education Together**

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

**Our Mission:** sdfghjk

**Our Vision:** asdfghjk

**Our Values:** wertyhj

**Our Programs:**

Would you like to know more about any specific program or service?', NULL, '2025-12-30 12:43:09', '2025-12-30 12:43:09');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (11, 3, 'user', 'how can i join them?', NULL, '2025-12-30 12:43:32', '2025-12-30 12:43:32');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (12, 3, 'assistant', 'I can help you learn about STEMpower Ethiopia. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, q... We offer programs in:

You can ask me about:
• What STEMpower does
• Our programs and services
• Upcoming events
• Contact information

What would you like to know?', NULL, '2025-12-30 12:43:32', '2025-12-30 12:43:32');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (13, 4, 'user', 'what can i get from the stempower as an student', NULL, '2025-12-30 12:50:50', '2025-12-30 12:50:50');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (14, 4, 'assistant', 'STEMpower Ethiopia is an organization dedicated to promoting STEM (Science, Technology, Engineering, and Mathematics) education in Ethiopia.

**Let''s Transform STEM Education Together**

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

**Our Mission:** sdfghjk

**Our Vision:** asdfghjk

**Our Values:** wertyhj

**Our Programs:**

Would you like to know more about any specific program or service?', NULL, '2025-12-30 12:50:50', '2025-12-30 12:50:50');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (15, 5, 'user', 'what can i get from the stempower as an student', NULL, '2025-12-30 13:01:55', '2025-12-30 13:01:55');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (16, 5, 'assistant', 'As a student, you can benefit from STEMpower in several ways:

STEM CENTERS:
• Access to 157 hands-on STEM Centers across Sub-Saharan Africa
• Participate in science fairs (17,000+ students have participated)
• Robotics workshops and hands-on learning
• Mentorship programs
• University outreach programs

FABLAB:
• Use 3D printing and rapid prototyping facilities
• Develop innovative science kits and projects
• Access maker spaces for hands-on innovation

ENTREPRENEURSHIP & DIGITAL SKILLS:
• Entrepreneurship training programs
• Digital skills training
• Business development support
• Startup incubation opportunities

STEM-TV:
• Access educational content and resources
• Learn from online educational materials

To get started, visit https://www.stempower.org/ or contact your nearest STEMpower office for more information about programs in your area.', NULL, '2025-12-30 13:01:55', '2025-12-30 13:01:55');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (17, 5, 'user', 'መረጃ ስጠኝ', NULL, '2025-12-30 13:06:49', '2025-12-30 13:06:49');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (18, 5, 'assistant', 'I can help you learn about STEMpower Ethiopia. Inside Every Child is a Scientist. Nurture that Scientist, you will change the world.

We offer programs in:
• STEM Centers (science fairs, robotics, university outreach)
• FabLab & Maker Space (3D printing, prototyping)
• Entrepreneurship & Incubation (business development, startup support)
• STEM-TV (educational content)

You can ask me about:
• What STEMpower does
• Our programs and services
• Upcoming events
• Contact information
• What students can get from STEMpower

What would you like to know?', NULL, '2025-12-30 13:06:49', '2025-12-30 13:06:49');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (19, 6, 'user', 'ምን አይነት ፕሮግራሞችን ታቀርባለህ?', NULL, '2025-12-30 18:40:06', '2025-12-30 18:40:06');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (20, 6, 'assistant', 'I can help you learn about STEMpower Ethiopia. Inside Every Child is a Scientist. Nurture that Scientist, you will change the world.

We offer programs in:
• STEM Centers (science fairs, robotics, university outreach)
• FabLab & Maker Space (3D printing, prototyping)
• Entrepreneurship & Incubation (business development, startup support)
• STEM-TV (educational content)

You can ask me about:
• What STEMpower does
• Our programs and services
• Upcoming events
• Contact information
• What students can get from STEMpower

What would you like to know?', NULL, '2025-12-30 18:40:06', '2025-12-30 18:40:06');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (21, 7, 'user', 'ማዕከላትዎ የት ይገኛሉ?', NULL, '2025-12-30 18:43:07', '2025-12-30 18:43:07');
INSERT INTO `chatbot_messages` (`id`, `sessionId`, `role`, `content`, `metadata`, `createdAt`, `updatedAt`) VALUES (22, 7, 'assistant', 'I can help you learn about STEMpower Ethiopia. Inside Every Child is a Scientist. Nurture that Scientist, you will change the world.

We offer programs in:
• STEM Centers (science fairs, robotics, university outreach)
• FabLab & Maker Space (3D printing, prototyping)
• Entrepreneurship & Incubation (business development, startup support)
• STEM-TV (educational content)

You can ask me about:
• What STEMpower does
• Our programs and services
• Upcoming events
• Contact information
• What students can get from STEMpower

What would you like to know?', NULL, '2025-12-30 18:43:07', '2025-12-30 18:43:07');

-- Data for table: chatbot_sessions
INSERT INTO `chatbot_sessions` (`id`, `title`, `userId`, `metadata`, `lastInteractionAt`, `createdAt`, `updatedAt`) VALUES (1, 'Chat with STEMpower Assistant', NULL, NULL, '2025-12-30 12:31:56', '2025-12-30 12:31:25', '2025-12-30 12:31:56');
INSERT INTO `chatbot_sessions` (`id`, `title`, `userId`, `metadata`, `lastInteractionAt`, `createdAt`, `updatedAt`) VALUES (2, 'Chat with STEMpower Assistant', NULL, NULL, '2025-12-30 12:38:11', '2025-12-30 12:37:47', '2025-12-30 12:38:11');
INSERT INTO `chatbot_sessions` (`id`, `title`, `userId`, `metadata`, `lastInteractionAt`, `createdAt`, `updatedAt`) VALUES (3, 'Chat with STEMpower Assistant', NULL, NULL, '2025-12-30 12:43:32', '2025-12-30 12:42:54', '2025-12-30 12:43:32');
INSERT INTO `chatbot_sessions` (`id`, `title`, `userId`, `metadata`, `lastInteractionAt`, `createdAt`, `updatedAt`) VALUES (4, 'Chat with STEMpower Assistant', NULL, NULL, '2025-12-30 12:50:50', '2025-12-30 12:50:28', '2025-12-30 12:50:50');
INSERT INTO `chatbot_sessions` (`id`, `title`, `userId`, `metadata`, `lastInteractionAt`, `createdAt`, `updatedAt`) VALUES (5, 'Chat with STEMpower Assistant', NULL, NULL, '2025-12-30 13:06:49', '2025-12-30 13:01:36', '2025-12-30 13:06:49');
INSERT INTO `chatbot_sessions` (`id`, `title`, `userId`, `metadata`, `lastInteractionAt`, `createdAt`, `updatedAt`) VALUES (6, 'Chat with STEMpower Assistant', NULL, NULL, '2025-12-30 18:40:06', '2025-12-30 18:40:01', '2025-12-30 18:40:06');
INSERT INTO `chatbot_sessions` (`id`, `title`, `userId`, `metadata`, `lastInteractionAt`, `createdAt`, `updatedAt`) VALUES (7, 'Chat with STEMpower Assistant', NULL, NULL, '2025-12-30 18:43:07', '2025-12-30 18:43:02', '2025-12-30 18:43:07');

-- Data for table: contact_offices
INSERT INTO `contact_offices` (`id`, `country_office`, `office_name`, `address`, `city`, `region`, `postal_code`, `email`, `phone`, `latitude`, `longtiude`, `createdAt`, `updatedAt`, `map_link`, `website`, `office_hours`, `mobile`, `image`) VALUES (1, 'Ethiopia', NULL, 'arbaminch', 'arbaminch', NULL, NULL, 'test@gmail.com', '0962042225', NULL, NULL, '2025-12-30 20:26:03', '2025-12-30 21:33:48', 'https://maps.google.com/maps?q=Addis+Ababa', NULL, NULL, NULL, 'https://res.cloudinary.com/dzcd8yymv/image/upload/v1767130435/contact_office/download.avif');

-- Data for table: dynamic_pages
INSERT INTO `dynamic_pages` (`id`, `title`, `slug`, `program`, `description`, `heroImage`, `heroTitle`, `heroSubtitle`, `heroDescription`, `ctaText`, `ctaLink`, `sections`, `status`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('317ccdb4-f2a5-4660-8cb4-2533dba5e465', 'srdtjfkhgj,hkj', 'latest-fstg', 'latest', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labo', '', 'Maker Space: Dream. Build. Discover.', 'we are a researcher ', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Learn More', '#', '[{"id":"1767125454500","type":"text","title":"adasfgesbg","content":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},{"id":"1767125460834","type":"image","title":"","content":""},{"id":"1767125461771","type":"cards","items":[{"title":"","description":""}],"title":"","content":""},{"id":"1767125463088","type":"stats","items":[{"title":"","description":""}],"title":"","content":""}]', 'published', '2025-12-30 20:15:32', '2025-12-30 20:11:06', '2025-12-30 20:15:32');
INSERT INTO `dynamic_pages` (`id`, `title`, `slug`, `program`, `description`, `heroImage`, `heroTitle`, `heroSubtitle`, `heroDescription`, `ctaText`, `ctaLink`, `sections`, `status`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('616ea76a-7578-4f3e-bffe-90e3a6afa76a', 'research ', 'fablab-', 'fablab', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '', 'Maker Space: Dream. Build. Discover.', 'we are a researcher ', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim', 'Learn More', '#', '[{"id":"1767125316222","type":"text","title":"dfshhb","content":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},{"id":"1767125323246","type":"image","title":"","content":""},{"id":"1767125330388","type":"cards","items":[{"title":"erdtfgy","description":"swertyukfdjshgfawasdmnf"},{"title":";lkjhgf","description":"lkjhgfds"},{"title":";lkjhgfd","description":"kjhgfdsa"}],"title":"","content":""}]', 'published', '2025-12-30 20:09:01', '2025-12-30 20:07:38', '2025-12-30 20:09:37');

-- Data for table: footer
INSERT INTO `footer` (`id`, `logo`, `description`, `copyrightText`, `contactEmail`, `contactPhone`, `contactAddress`, `createdAt`, `updatedAt`) VALUES (1, 'https://res.cloudinary.com/dzcd8yymv/image/upload/v1767130655/footer/Gemini_Generated_Image_z6zx4zz6zx4zz6zx.png', 'tttEmpowering Ethiopian youth through science, technology, engineering, and mathematics education.awsedrtfgykhuijokpl', 'eeeeeSTEMpower Ethiopia. All rights reserved. | Empowering the next generation through STEM education.', 'kinfo@stempowerethiopia.org', '0962042225', 'arbamfghjinch', '2025-12-18 09:21:51', '2025-12-30 21:38:13');

-- Data for table: footer_section_links
INSERT INTO `footer_section_links` (`id`, `label`, `url`, `order`, `is_active`, `footerSectionId`, `createdAt`, `updatedAt`) VALUES (1, 'safa', 'asfd.com', 0, 1, 1, '2025-12-30 21:39:36', '2025-12-30 21:39:36');

-- Data for table: footer_sections
INSERT INTO `footer_sections` (`id`, `title`, `order`, `is_active`, `createdAt`, `updatedAt`) VALUES (1, 'ainfdl dc', 0, 1, '2025-12-30 21:39:36', '2025-12-30 21:39:36');

-- Data for table: footer_social_links
INSERT INTO `footer_social_links` (`id`, `platform`, `url`, `order`, `is_active`, `createdAt`, `updatedAt`) VALUES (1, 'linkedin', 'sadbo.com', 0, 1, '2025-12-30 21:39:03', '2025-12-30 21:39:03');
INSERT INTO `footer_social_links` (`id`, `platform`, `url`, `order`, `is_active`, `createdAt`, `updatedAt`) VALUES (2, 'instagram', 'sadvf.com', 0, 1, '2025-12-30 21:39:15', '2025-12-30 21:39:15');

-- Data for table: hero_sections
INSERT INTO `hero_sections` (`id`, `title`, `subtitle`, `image_url`, `isActive`, `createdAt`, `updatedAt`, `description`, `cta`, `ctaSecondary`, `stat1Label`, `stat1Value`, `stat2Label`, `stat2Value`, `stat3Label`, `stat3Value`) VALUES (1, 'sdgszznjt', 'njsoad hero is hero hero mnmdebsi ', 'https://res.cloudinary.com/dzcd8yymv/image/upload/v1766054025/hero_section/hero-image.avif', 1, '2025-12-18 10:33:58', '2025-12-18 10:33:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `hero_sections` (`id`, `title`, `subtitle`, `image_url`, `isActive`, `createdAt`, `updatedAt`, `description`, `cta`, `ctaSecondary`, `stat1Label`, `stat1Value`, `stat2Label`, `stat2Value`, `stat3Label`, `stat3Value`) VALUES (2, 'inside every child is scientics ', 'subtitle badge', 'https://res.cloudinary.com/dzcd8yymv/image/upload/v1766054228/hero_section/hero-image.png', 1, '2025-12-18 10:37:06', '2025-12-18 10:37:06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `hero_sections` (`id`, `title`, `subtitle`, `image_url`, `isActive`, `createdAt`, `updatedAt`, `description`, `cta`, `ctaSecondary`, `stat1Label`, `stat1Value`, `stat2Label`, `stat2Value`, `stat3Label`, `stat3Value`) VALUES (3, 'New Thing ', 'subtitle badge', 'https://res.cloudinary.com/dzcd8yymv/image/upload/v1766065890/hero_section/hero-image.jpg', 1, '2025-12-18 13:51:28', '2025-12-18 13:51:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- Data for table: impact_dashboard
INSERT INTO `impact_dashboard` (`id`, `program_participation`, `stem_centers`, `events_held`, `is_active`, `createdAt`, `updatedAt`) VALUES (1, 0, 0, 0, 1, '2025-12-18 10:34:52', '2025-12-18 10:34:52');

-- Data for table: social_links
INSERT INTO `social_links` (`id`, `platform`, `url`, `icon`, `createdAt`, `updatedAt`) VALUES (3, 'twitter', 'https://abebe.com', '𝕏', '2025-12-30 20:28:56', '2025-12-30 20:28:56');
INSERT INTO `social_links` (`id`, `platform`, `url`, `icon`, `createdAt`, `updatedAt`) VALUES (4, 'telegram', 'https://t.me/afninif', '✈', '2025-12-30 20:28:56', '2025-12-30 20:28:56');

-- Data for table: users
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `createdAt`, `updatedAt`, `permissions`) VALUES (1, 'stempower', 'stempower@gmail.com', '$2b$10$EJ/FsyXYd7vItPhWrs6Tzu/ZAe8Zvb3tNVue4xojgxO2/Do0FTQJ6', 'admin', 1, '2025-12-30 18:58:58', '2026-01-10 12:34:15', NULL);
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `createdAt`, `updatedAt`, `permissions`) VALUES (2, 'serk', 'serkalemhailu16@gmail.com', '$2b$10$86syZti9u03GZ/bd5MBf2OX2QYgvT0zQSfkgC4MJuHmzx83VHJtvy', 'contributor', 1, '2025-12-30 19:00:52', '2025-12-30 19:00:52', NULL);
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `createdAt`, `updatedAt`, `permissions`) VALUES (3, 'Admin', 'test@gmail.com', '$2b$10$Fbr2K0yn43SwqXW2VtzcOeRvFoG9znmhx/rFrsbLhcNT/scq6Mzuy', 'editor', 1, '2025-12-30 22:07:34', '2025-12-30 22:07:34', NULL);
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `createdAt`, `updatedAt`, `permissions`) VALUES (4, 'stempower1', 'stempower1@gmail.com', '$2b$10$Vyevrc/M/sVdJiJJsC/aCuk.8ISOfARWcOhJrr2d8MMSuxk5KtKj6', 'admin', 1, '2026-01-10 12:44:14', '2026-01-10 12:44:14', NULL);

SET FOREIGN_KEY_CHECKS=1;
