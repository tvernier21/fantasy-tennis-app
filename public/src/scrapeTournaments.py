from bs4 import BeautifulSoup
from datetime import datetime
from pymongo import MongoClient
import os
from dotenv import load_dotenv

from initScraper import init_driver

print("Starting")

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
URL = "https://www.atptour.com/en/scores/results-archive?year=2023&tournamentType=atpgs"

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
    "250": 1,
    "500": 2,
    "1000": 3,
    "grandslam": 4
}
print("Scraping Tournaments")
i=0
tournaments_data = []
for tournament in tournaments:
    # skip nitto and united cup for now
    name = tournament.find("a", {"class": "tourney-title"}).text.strip()
    if name == "Nitto ATP Finals" or name == "United Cup" or name == "Laver Cup":
        continue
    location = tournament.find("span", {"class": "tourney-location"}).text.strip()
    date = tournament.find("span", {"class": "tourney-dates"}).text.strip()
    surface = tournament.find_all("td", {"class": "tourney-details"})[1].find("span").text.strip()
    img = "https://www.atptour.com/" + tournament.find("img")["src"]
    try:
        link = "https://www.atptour.com/" + tournament.select_one("td.tourney-details a.button-border")['href']
    except:
        link = None
    difficulty = difficulty_map[img.split("_")[1].split(".")[0]]

    tmp = {
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
    i+=1
    if i <= 3:
        print(tmp)
    tournaments_data.append(tmp)

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