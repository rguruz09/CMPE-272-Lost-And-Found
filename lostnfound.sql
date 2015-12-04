-- MySQL dump 10.13  Distrib 5.6.27, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: LOSTNFOUND
-- ------------------------------------------------------
-- Server version	5.6.27-0ubuntu1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `found`
--

DROP TABLE IF EXISTS `found`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `found` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emailid` varchar(50) DEFAULT NULL,
  `itemname` varchar(45) DEFAULT NULL,
  `itemdesc` varchar(45) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `flag` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `emailid_FK1` (`emailid`),
  CONSTRAINT `emailid_FK1` FOREIGN KEY (`emailid`) REFERENCES `users` (`emailid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `found`
--

LOCK TABLES `found` WRITE;
/*!40000 ALTER TABLE `found` DISABLE KEYS */;
INSERT INTO `found` VALUES (3,'dp@gm.com','ear phone','JBL',NULL,NULL,-1,'2013-09-11','10:15:00');
/*!40000 ALTER TABLE `found` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lost`
--

DROP TABLE IF EXISTS `lost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lost` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emailid` varchar(50) DEFAULT NULL,
  `itemname` varchar(45) DEFAULT NULL,
  `itemdesc` varchar(45) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `flag` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `emailid_FK` (`emailid`),
  CONSTRAINT `emailid_FK` FOREIGN KEY (`emailid`) REFERENCES `users` (`emailid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lost`
--

LOCK TABLES `lost` WRITE;
/*!40000 ALTER TABLE `lost` DISABLE KEYS */;
INSERT INTO `lost` VALUES (3,'dp@gm.com','Watch','Black fossil',NULL,NULL,-1,'2015-09-12','09:10:00'),(4,'dp@gm.com','Bag','Green PUMA',NULL,NULL,-1,'2015-09-12','09:10:00'),(5,'dp@gm.com','Soap','MSL',NULL,NULL,-1,'2015-09-12','09:10:00'),(6,'dp@gm.com','wallet','BNB',NULL,NULL,-1,'2015-09-12','09:10:00'),(7,'dp@gm.com','Mug','asdasdasd',NULL,NULL,-1,'2015-09-12','09:10:00'),(8,'dp@gm.com','Chombu','lota',NULL,NULL,-1,'2015-09-12','09:10:00'),(9,'dp@gm.com','mobile','dabba mobile',NULL,NULL,-1,'2015-09-12','09:10:00'),(10,'dp@gm.com','undefined','undefined',NULL,NULL,-1,'2015-09-12','09:10:00'),(11,'dp@gm.com','undefined','undefined',NULL,NULL,-1,'2015-09-12','09:10:00');
/*!40000 ALTER TABLE `lost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `emailid` varchar(50) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `Email` (`emailid`),
  UNIQUE KEY `Mobile_Number` (`mobile`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'neha','sah','neha.sah20@gmail.com','123','Hello123'),(2,'Raghu','Guru','raghavendra1810@gmail.com','6692389310','1223'),(3,'Shruti','K','shr@gm.com','1234567890','12345'),(4,'Samhitha','Pyla','sm@gm.com','1010100101','123'),(5,'Deepika','PG','dp@gm.com','1212121212','123'),(6,'Katrina','K','kt@gm.com','1010101010','123'),(7,'Megha','Hegde','mg@gm.com','9911007789','12345'),(8,'Sahithi','Krishna','sh@gm.com','8979087278','123'),(9,'Roopa','V','rp@gm.com','7897567890','1234'),(13,'Maya','P','my@gm.com','1212342345','12345');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_location`
--

DROP TABLE IF EXISTS `users_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_location` (
  `emailid` varchar(50) NOT NULL DEFAULT '',
  `latitude` double DEFAULT NULL,
  `langitude` double DEFAULT NULL,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`emailid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_location`
--

LOCK TABLES `users_location` WRITE;
/*!40000 ALTER TABLE `users_location` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_location` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-12-03 16:50:06
