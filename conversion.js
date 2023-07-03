const MongoClient = require("mongodb").MongoClient;
const EPUBParser = require("epub-parser");
const dotenv = require("dotenv")
const fs = require("fs");

//config env file
dotenv.config()

// Connection URL
const url = process.env.MONGO_URL;
const dbName = "Red-Rising-Series";
const collectionName = "Books";

// Create a new MongoClient
const client = new MongoClient(url);
