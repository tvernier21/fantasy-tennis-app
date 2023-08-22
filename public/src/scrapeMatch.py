from bs4 import BeautifulSoup
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import time
import random

from initScraper import init_driver
from scrapePlayer import insertNewPlayer

print("Starting")

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
client = MongoClient(DATABASE_URL)
db = client["test"]
#database
tournaments_db = db["Tournament"]
players_db = db["Player"]
matches_db = db["Match"]

matches_db.delete_many({})

def formatScore(score):
    if "W/O" in raw_score:
        return "(W/O)"
    
    final_score = ""
    for s in score:
        if s == "(W/O)":
            final_score += s`
        set_score = s.split("<sup>")[0]
        tiebreak_score = s.split("<sup>")[1].split("</sup>")[0]
        
        if len(set_score)%2 == 0:
            set_score = set_score[:len(set_score)//2] + "-" + set_score[len(set_score)//2:]
        else:

        
    final_score = ""
    i = 0
    while i < len(raw_score):
        skip = 2
        set = raw_score[i] + "-" + raw_score[i+1]
        if set == "7-6" or set == "6-7":
            set = set + "(" + raw_score[i+2] + ")"
            skip = 3
        final_score = final_score + set + " "
        i = i + skip
    return final_score.strip() + extra


tournaments = list(tournaments_db.find({}, {"_id": 1, "link": 1, "date": 1}))
for tournament in tournaments:
    matches = []
    t_id, t_link, t_date = tournament["_id"], tournament["link"], tournament["date"]

    if not t_link:
        continue

    print("Scraping " + t_link)
    # Create a new instance of the Chrome driver
    driver = init_driver()

    driver.get(t_link + "?matchType=singles")
    # Wait for page to load
    while driver.execute_script("return document.readyState") != "complete":
        pass

    # Get Each Tournament
    soup = BeautifulSoup(driver.page_source, "html.parser")
    tournament_soup = soup.find("table", {"class": "day-table"})
    
    theads = tournament_soup.find_all("thead")
    tbodys = tournament_soup.find_all("tbody")
    for thead, tbody in zip(theads, tbodys):
        round_name = thead.tr.th.get_text(strip=True)
        print(f"  Scraping {round_name} matches")

        for row in tbody.find_all("tr"):
            player_cells = row.find_all('td', class_='day-table-name')
            winner_cell = player_cells[0]
            loser_cell = player_cells[1]
            score_cell = row.find('td', class_='day-table-score')
            
            # Extract player names and score
            winner_name = winner_cell.a.get_text(strip=True)
            loser_name = loser_cell.a.get_text(strip=True)
            score = score_cell.find('a', class_='not-in-system').get_text(strip=True, separator=' ').split()
            score = formatScore(score)

            # Get player ids
            try:
                winner_id = players_db.find_one({"name": loser_name})["_id"]
            except:
                winner_id = insertNewPlayer(players_db, winner_name, winner_cell.a["href"], t_date)
            try:
                loser_id = players_db.find_one({"name": loser_name})["_id"]
            except:
                loser_id = insertNewPlayer(players_db, loser_name, loser_cell.a["href"], t_date)

            match_data = {
                'winnerId': winner_id,
                'loserId': loser_id,
                'tournamentId': t_id,
                'winner_name': winner_name,
                'loser_name': loser_name,
                'round': round_name,
                'score': score,
                'date': t_date,
                'createdAt': datetime.now(),
                'updatedAt': datetime.now()
            }
            print(f"    Inserted {winner_name} vs {loser_name} - ({score})")
            matches.append(match_data)
            
            

    driver.quit()
    matches_db.insert_many(matches)
    time.sleep(random.randint(1, 2))
    

client.close()
print("Client Closed")
