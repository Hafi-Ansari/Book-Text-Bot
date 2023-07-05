import os
import ebooklib
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

connection_string = os.getenv("MONGO_URL")
client = MongoClient(connection_string)
db = client['Red-Rising-Series']
collection = db['Red Rising']

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
    chapter_number = 1
    curr = 1 
    for chapter in chapters[7:53]:
        paragraphs = chapter.split("\n")
        word_count = sum(len(paragraph.split()) for paragraph in paragraphs)
        
        # Ignore chapters that don't have at least 100 words
        if word_count < 100:
            continue
        
        for paragraph in paragraphs:
            if paragraph.strip() != "":
                doc = {
                    "_id": ObjectId(),
                    "order": curr, 
                    "book_title": book_title,
                    "chapter_number": chapter_number,
                    "text": paragraph.strip(),
                }
                collection.insert_one(doc)
                curr += 1 

        chapter_number += 1



chapters = parse_epub(epub_file)

insert_chapters_into_db(chapters, "Red Rising")




