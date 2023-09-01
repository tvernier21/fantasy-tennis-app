from bs4 import BeautifulSoup, Comment
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import time
import random
from bson.objectid import ObjectId

from initScraper import init_driver


LINK = "https://www.atptour.com/en/scores/current/us-open/560/draws"
TOURNAMENT_ID = "64e3f9d12d77fc1e69061767"

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
client = MongoClient(DATABASE_URL)
db = client["test"]
#database
tournaments_db = db["Tournament"]
players_db = db["Player"]
tournamentPlayers_db = db["TournamentPlayer"]

tournament = tournaments_db.find_one({"_id": ObjectId(TOURNAMENT_ID)})

driver = init_driver()
driver.get(LINK)
while driver.execute_script("return document.readyState") != "complete":
    pass
soup = BeautifulSoup(driver.page_source, "html.parser")

first_rounds = soup.find('table', {'class': 'scores-draw-table'}).tbody.find_all('tr')
for first_round in first_rounds:
    players_box = first_round.td.find_all('tr')
    for player_box in players_box:
        name = player_box.find('a').get_text(strip=True)
        player = players_db.find_one({"name": name})
        if player is None:
            player_link = "https://www.atptour.com" + player_box.find('a')['href']
            player_driver = init_driver()
            player_driver.get(player_link)
            while player_driver.execute_script("return document.readyState") != "complete":
                pass
            player_soup = BeautifulSoup(player_driver.page_source, "html.parser")
            player_name = player_soup.find('div', {'class': 'player-profile-hero-name'})
            first_name = player_name.find('div', {'class': 'first-name'}).get_text(strip=True)
            last_name = player_name.find('div', {'class': 'last-name'}).get_text(strip=True)
            name = first_name + " " + last_name

            player = players_db.find_one({"name": name})
            if player is None:
                print("REEEEE")
                break
        
        tournamentPlayer = {
            "player_id": player['_id'],
            "tournament_id": tournament['_id'],
            "elo": player['elo'],
            "points": 0,
            "active": True,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
        tournamentPlayers_db.insert_one(tournamentPlayer)

client.close()
driver.close()
