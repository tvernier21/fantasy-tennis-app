from bs4 import BeautifulSoup
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import re
import time
import random
from difflib import get_close_matches

from initScraper import init_driver

print("Starting")

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
client = MongoClient(DATABASE_URL)
db = client["test"]
#database
tournaments_db = db["Tournament"]
players_db = db["Player"]
matches_db = db["Match"]


tournaments = list(tournaments_db.find({}, {"_id": 1, "link": 1}))
for tournament in tournaments:
    matches = []
    t_id, t_link = tournament["_id"], tournament["link"]

    if not t_link:
        continue

    # Create a new instance of the Chrome driver
    driver = init_driver()
    print("Driver Initialized")

    driver.get(t_link + "?matchType=singles")
    # Wait for page to load
    while driver.execute_script("return document.readyState") != "complete":
        pass
    print("Page Loaded")

    # Get Each Tournament
    soup = BeautifulSoup(driver.page_source, "html.parser")
    tournament_soup = soup.find("table", {"class": "day-table"})
    
    theads = tournament_soup.find_all("thead")
    tbodys = tournament_soup.find_all("tbody")
    for thead, tbody in zip(theads, tbodys):
        round_name = thead.tr.th.get_text(strip=True)

        for row in tbody.find_all("tr"):
            player_cells = row.find_all('td', class_='day-table-name')
            score_cell = row.find('td', class_='day-table-score')
            
            # Extract player names and score
            winner_name = clean_text(player_cells[0].a.get_text(strip=True))
            loser_name = clean_text(player_cells[1].a.get_text(strip=True))
            score = score_cell.a.get_text(strip=True)

            # Get player ids
            skip = False
            try:
                winner_id = players_db.find_one({"name": winner_name})["_id"]
            except:
                print(f"{winner_name} not found")
                name_match = get_close_matches(winner_name, player_names, cutoff=0.7)
                print(f"Closest matches: {name_match}")
                if len(name_match) > 0:
                    winner_name = name_match[0]
                    winner_id = players_db.find_one({"name": winner_name})["_id"]
                else:
                    skip=True

            try:
                loser_id = players_db.find_one({"name": loser_name})["_id"]
            except:
                print(f"{loser_name} not found")
                name_match = get_close_matches(loser_name, player_names, cutoff=0.7)
                print(f"Closest matches: {name_match}")
                if len(name_match) > 0:
                    loser_name = name_match[0]
                    loser_id = players_db.find_one({"name": loser_name})["_id"]
                else:
                    skip=True

            if skip:
                continue

            match_data = {
                'winnerId': winner_id,
                'loserId': loser_id,
                'tournamentId': t_id,
                'winner_name': winner_name,
                'loser_name': loser_name,
                'round': round_name,
                'score': score,
                'createdAt': datetime.now(),
                'updatedAt': datetime.now()
            }
            matches.append(match_data)


    time.sleep(random.randint(1, 5))
    
# matches_db = db["Match"]
# results = matches_db.insert_many(matches)
# print("Inserted " + str(len(results.inserted_ids)) + " matches")

driver.quit()
print("Driver Quit")
client.close()
print("Client Closed")
