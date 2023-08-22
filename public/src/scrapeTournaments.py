from bs4 import BeautifulSoup
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
import os
# import time
# import random

from initScraper import init_driver

print("Starting")

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
URL = "https://www.atptour.com/en/scores/results-archive?"

# Create a new instance of the Chrome driver
driver = init_driver()
print("Driver Initialized")

driver.get(URL)
# Wait for page to load
while driver.execute_script("return document.readyState") != "complete":
    pass
print("Page Loaded")

# Get Each Tournament
soup = BeautifulSoup(driver.page_source, "html.parser")
table = soup.find("table", {"class": "results-archive-table mega-table"})
tournaments = table.find_all("tr", {"class": "tourney-result"})

""" Write code to read from database to merge the data """

difficulty_map = {
    "challenger": 1,
    "250": 2,
    "500": 3,
    "1000": 4,
    "grandslam": 5
}

year = 2005
tournament_categories = ["ch", "atpgs"]
tournaments_data = []
while year <= 2023:
    for t_type in tournament_categories:
        print(f"Year: {year}, Type: {t_type}")
        # Create a new instance of the Chrome driver
        driver = init_driver()
        print("Driver Initialized")

        driver.get(URL + f'year={year}&tournamentType={t_type}')
        # Wait for page to load
        while driver.execute_script("return document.readyState") != "complete":
            pass
        print("Page Loaded")

        # Get Each Tournament
        soup = BeautifulSoup(driver.page_source, "html.parser")
        table = soup.find("table", {"class": "results-archive-table mega-table"})
        tournaments_table = table.find_all("tr", {"class": "tourney-result"})

        for tournament_table in tournaments_table:
            # skip nitto and united cup for now
            name = tournament_table.find("a", {"class": "tourney-title"}).text.strip()
            if name == "Nitto ATP Finals" or name == "United Cup" or name == "Laver Cup":
                continue
            location = tournament_table.find("span", {"class": "tourney-location"}).text.strip()
            date = datetime.strptime(str(tournament_table.find("span", {"class": "tourney-dates"}).text.strip()),
                                     '%Y.%m.%d')
            surface = tournament_table.find_all("td", {"class": "tourney-details"})[1].find("span").text.strip()
            try:
                img = "https://www.atptour.com" + tournament_table.find("img")["src"]
            except:
                img = None
            try:
                link = "https://www.atptour.com" + tournament_table.select_one("td.tourney-details a.button-border")['href']
            except:
                link = None
            try:
                difficulty = difficulty_map[img.split("_")[1].split(".")[0]]
            except:
                difficulty = 3

            tournament = {
                "name": name,
                "location": location,
                "date": date,
                "surface": surface,
                "difficulty": difficulty,
                "img": img,
                "link": link,
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
            tournaments_data.append(tournament)
    year += 1

# close the browser window
driver.quit()
print("Driver Closed")

# Connect to MongoDB
client = MongoClient(DATABASE_URL)
db = client["test"]
collection = db["Tournament"]

result = collection.insert_many(tournaments_data)
print(result.acknowledged)
print(len(result.inserted_ids))

# Close connection
client.close()