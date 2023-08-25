from bs4 import BeautifulSoup
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
from bson import ObjectId
import os

from initScraper import init_driver


def insertNewPlayer(collection, name, URL, t_date=None):
    """Insert a new player into the database"""

    playerURL = "https://www.atptour.com" + URL.replace("overview", "player-activity?year=all&matchType=Singles")
    driver = init_driver()
    driver.get(playerURL)
    # Wait for page to load
    while driver.execute_script("return document.readyState") != "complete":
        pass

    try:
        # Get player table and rows
        soup = BeautifulSoup(driver.page_source, "html.parser")

        # isActive
        active = True
        try:
            activity = soup.find("div", 
                                {"class": "player-ranking-position"}).find("div", 
                                                                            {"class": "data-label-text"}).get_text(strip=True)
            if activity == "Inactive":
                active = False
        except:
            pass

        # img
        try:
            img_link = soup.find("div", {"class": "player-profile-hero-image"}).img["src"]
            img = "https://www.atptour.com" + img_link
        except:
            img = None

        # age, weight, height
        hero_table = soup.find("div", {"class": "player-profile-hero-table"}).table.tbody

        try:
            dob = hero_table.find("span", {"class": "table-birthday"}).get_text(strip=True).replace("(", "").replace(")", "")
            dob = datetime.strptime(dob, "%Y.%m.%d")
        except:
            dob = None

        try:
            weight = hero_table.find("span", {"class": "table-weight-lbs"}).get_text(strip=True)
        except:
            weight = None

        try:
            height = hero_table.find("span", {"class": "table-height-ft"}).get_text(strip=True)
        except:
            height = None

        # Last match played
        try:
            last_tournament = soup.find_all("div", {"class": "activity-tournament-table"})[0]
            dates = last_tournament.find("span", {"class": "tourney-dates"}).get_text(strip=True)
            last_match_date = datetime.strptime(dates.split("-")[0].strip(), "%Y.%m.%d")
        except:
            print("whoopsies")
            last_match_date = t_date

        player_id  = ObjectId()
        player = {
            "_id": player_id,
            "name": name,
            "dob": dob,
            "weight": weight,
            "height": height,
            "rank": 0,
            "elo": 1300,
            "isActive": active,
            "lastMatch": last_match_date,
            "img": img,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
    except:
        player_id  = ObjectId()
        player = {
            "name": player_id,
            "dob": None,
            "weight": None,
            "height": None,
            "rank": 0,
            "elo": 1300,
            "isActive": False,
            "lastMatch": t_date,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }

    collection.insert_one(player)
    driver.close()

    return player_id

if __name__ == "__main__":
    load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")
    # Connect to Database
    client = MongoClient(DATABASE_URL)
    db = client["test"]
    collection = db["Player"]
    # collection.delete_many({})
    # insertNewPlayer(collection, "Pierre-Hugues Herbert", "/en/players/pierre-hugues-herbert/h996/overview")
    # insertNewPlayer(collection, "Ivan Ljubicic", "/en/players/ivan-ljubicic/l360/overview")
    # newId = insertNewPlayer(collection, "Derek Pham", "/en/players/derek-pham/p0kj/overview")
    # print(newId)
    client.close()