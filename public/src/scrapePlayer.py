from selenium import webdriver
from bs4 import BeautifulSoup
from datetime import datetime
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
URL = "https://tennisabstract.com/reports/atp_elo_ratings.html"


# Create a new instance of the Chrome driver
options = webdriver.ChromeOptions()
options.add_argument("--no-sandbox")
options.add_argument("--headless")
options.add_argument("--disable-dev-shm-usage")
driver = webdriver.Chrome(options=options)
driver.get(URL)

# Get player table and rows
soup = BeautifulSoup(driver.page_source, "html.parser")
table = soup.find_all("table")[-1].find("tbody")
players_html = table.find_all("tr")

""" Write code to read from database to merge the data """

def valueErrorCheck(value):
    try:
        return float(value)
    except ValueError:
        return None

players = []
for player in players_html:
    data = player.find_all("td")

    age = valueErrorCheck(data[2].text)
    elo = valueErrorCheck(data[3].text)
    hard_elo = valueErrorCheck(data[9].text)
    clay_elo = valueErrorCheck(data[10].text)
    grass_elo = valueErrorCheck(data[11].text)
    players.append({
        "name": data[1].text.strip().replace("\xa0", " "),
        "age": age,
        "rank": int(data[0].text),
        "elo": elo,
        "hard_elo": hard_elo,
        "clay_elo": clay_elo,
        "grass_elo": grass_elo,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

# Connect to Database
client = MongoClient(DATABASE_URL)
db = client["fantasy-tennis-db"]
collection = db["Player"]

# Insert players into database
result = collection.insert_many(players)
print(result.acknowledged)
print(len(result.inserted_ids))

client.close()
driver.quit()
