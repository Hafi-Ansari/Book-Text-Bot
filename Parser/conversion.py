import os
import ebooklib
import bs4
from dotenv import load_dotenv
from pymongo import MongoClient
from ebooklib import epub
from bs4 import BeautifulSoup
from bson.objectid import ObjectId

# Load variables from .env file
load_dotenv()

# book file-path
# chapters[7] starts Red Rising, chapters[53] ends it
epub_file = "Red-Rising.epub"

url = os.getenv("MONGO_URL")
client = MongoClient(url)
db = client['Red-Rising-Series']
collection = db['Books']

def parse_epub(epub_file):
    book = epub.read_epub(epub_file)
    chapters = []

    for item in book.get_items():
        if item.get_type() == ebooklib.ITEM_DOCUMENT:
            soup = BeautifulSoup(item.get_content().decode('windows-1252', 'ignore'), 'html.parser')
            result = soup.get_text()
            result = result.replace('â€™', "'")
            result = result.replace('â€œ', '"')
            result = result.replace('â€', '"')
            chapters.append(result)
    
    return chapters



def insert_chapters_into_db(chapters, book_title):
    for i, chapter in enumerate(chapters):
        paragraphs = chapter.split("\n")
        
        for paragraph in paragraphs:
            if paragraph.strip() != "":
                doc = {
                    "_id": ObjectId(),
                    "book_title": book_title,
                    "chapter_number": i + 1,
                    "text": paragraph.strip(),
                }
                
                #collection.insert_one(doc)
                print(doc)

chapters = parse_epub(epub_file)

with open("example.txt", "a") as file:
    # Write the content to the file
    file.write(chapters[53])

# Confirm that the content has been inserted
print("Content inserted successfully.")




