from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
client = MongoClient(DATABASE_URL)
db = client["test"]

#database
players_db = db["Player"]
matches_db = db["Match"]

# unique names
players_names = list(players_db.distinct("name"))

for name in players_names:
    player_rows = players_db.find({"name": name})

    for player_row in player_rows:
        player_id = player_row["_id"]
        won_matches = matches_db.count_documents({"winnerId": player_id})
        lost_matches = matches_db.count_documents({"loserId": player_id})

        if won_matches == 0 and lost_matches == 0:
            players_db.delete_one({"_id": player_id})
            print(f"Deleted {name}")

client.close()
