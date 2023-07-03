const dotenv = require("dotenv")

//config env file
dotenv.config()

//epub name
const book = "Red-Rising"

// Connection URL
const url = process.env.MONGO_URL;
const dbName = "Red-Rising-Series";
const collectionName = "Books";

