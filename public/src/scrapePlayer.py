from selenium import webdriver
from bs4 import BeautifulSoup
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import ObjectId
import os
import re

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
URL = "https://tennisabstract.com/reports/atp_elo_ratings.html"


# # Create a new instance of the Chrome driver
# options = webdriver.ChromeOptions()
# options.add_argument("--no-sandbox")
# options.add_argument("--headless")
# options.add_argument("--disable-dev-shm-usage")
# driver = webdriver.Chrome(options=options)
# driver.get(URL)

# # Get player table and rows
# soup = BeautifulSoup(driver.page_source, "html.parser")
# table = soup.find_all("table")[-1].find("tbody")
# players_html = table.find_all("tr")

# """ Write code to read from database to merge the data """

# def valueErrorCheck(value):
#     try:
#         return float(value)
#     except ValueError:
#         return None

# def clean_text(text):
#     # Replace anything that isn't an alphabet with a space
#     cleaned = re.sub(r"[^a-zA-Z]", ' ', text)
#     # Replace multiple spaces with a single space
#     cleaned = re.sub(r"\s+", ' ', cleaned)
#     return cleaned.strip()


# players = []
# players_elos = []
# for player in players_html:
#     data = player.find_all("td")

#     name = clean_text(data[1].a.get_text(strip=True))
#     age = valueErrorCheck(data[2].text)
#     elo = valueErrorCheck(data[3].text)
#     hard_elo = valueErrorCheck(data[9].text)
#     clay_elo = valueErrorCheck(data[10].text)
#     grass_elo = valueErrorCheck(data[11].text)

#     print(name)

#     player_id = ObjectId()

#     players.append({
#         "_id": player_id,
#         "name": name,
#         "age": age,
#         "rank": int(data[0].text),
#         "elo": elo,
#         "createdAt": datetime.now(),
#         "updatedAt": datetime.now()
#     })
#     players_elos.append({
#         "playerId": player_id,
#         "elo": [elo],
#         "hard_elo": [hard_elo],
#         "clay_elo": [clay_elo],
#         "grass_elo": [grass_elo],
#         "dates": [datetime.now()],
#         "createdAt": datetime.now(),
#         "updatedAt": datetime.now()
#     })


# Connect to Database
client = MongoClient(DATABASE_URL)
db = client["test"]
collection = db["Player"]
collection.delete_many({})

# Insert players into database
# collection.delete_many({})
# result = collection.insert_many(players)
# print(result.acknowledged)
# print(len(result.inserted_ids))

collection = db["PlayerElos"]
collection.delete_many({})
# result = collection.insert_many(players_elos)
# print(result.acknowledged)
# print(len(result.inserted_ids))

client.close()
# driver.quit()
