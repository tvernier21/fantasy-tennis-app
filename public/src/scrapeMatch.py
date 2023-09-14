from bs4 import BeautifulSoup, Comment
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

# matches_db.delete_many({})

def formatScore(score):
    if "(W/O)" in score:
        return "(W/O)"
    
    final_score = ""
    extra = ""
    for s in score:
        tmp = s
        if "<sup>" in tmp:
            tmp = tmp.replace("<sup>", "").replace("</sup>", "")
            final_score = final_score[:-1]
            final_score += f'({tmp}) '
            continue
        if "(RET)" in tmp or "(DEF)" in tmp:
            extra = "(RET)"
            tmp = tmp.split(" ")[0].strip()
            if tmp == "(RET)" or tmp == "(DEF)":
                continue

        set_score = tmp[:len(tmp)//2] + "-" + tmp[len(tmp)//2:]
        if len(tmp)%2 == 1:
            s1 = int(set_score.split("-")[0])
            s2 = int(set_score.split("-")[1])
            if abs(s1-s2) > 2:
                set_score = tmp[:(len(tmp)//2)+1] + "-" + tmp[(len(tmp)//2)+1:]

        final_score = final_score + set_score + " "
    final_score = final_score + extra
    return final_score.strip()

def tag_content_to_list(tag):
    parts = []
    for child in tag.children:
        # If it's a comment, skip
        if isinstance(child, Comment):
            continue
        # If it's another tag, convert to string
        elif child.name:
            parts.append(str(child))
        # Else, it's just text
        else:
            stripped_text = child.strip()
            if stripped_text:  # Make sure it's not an empty string
                parts.append(stripped_text)
    return parts

# delete matches after 09/15/2023
matches_db.delete_many({"date": {"$gt": datetime(2023, 8, 15)}})

# find tournaments from db that are difficulty > 1 and past a certain date
tournaments = tournaments_db.find({"difficulty": {"$gt": 1}, "date": {"$gt": datetime(2023, 8, 15)}},
                                  {"_id": 1, "link": 1, "date": 1})

tournaments = list(tournaments)
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

    if tournament_soup is None:
        continue
    
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
            try:
                winner_name = winner_cell.a.get_text(strip=True)
            except:
                continue # Bye Round
            try:
                loser_name = loser_cell.a.get_text(strip=True)
            except:
                continue
            loser_name = loser_cell.a.get_text(strip=True)
            score = formatScore(tag_content_to_list(score_cell.find('a')))

            # Get player ids
            new_player = False
            try:
                winner_id = players_db.find_one({"name": winner_name})["_id"]
            except:
                winner_id = insertNewPlayer(players_db, winner_name, winner_cell.a["href"], t_date)
                new_player = True
            try:
                loser_id = players_db.find_one({"name": loser_name})["_id"]
            except:
                loser_id = insertNewPlayer(players_db, loser_name, loser_cell.a["href"], t_date)
                new_player = True

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
            matches.append(match_data)
            print_string = f"    Inserted {winner_name} vs {loser_name} - ({score})"
            if new_player:
                print_string += " + New Player"
            print(print_string)
            
            

    driver.quit()
    matches_db.insert_many(matches)
    time.sleep(random.randint(1, 2))


client.close()
print("Client Closed")
