import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load variables from .env file
load_dotenv()

url = os.getenv("MONGO_URL")

