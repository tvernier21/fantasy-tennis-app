from pymongo import MongoClient
from dotenv import load_dotenv
import os


def addTournamentName(matches, tournaments):
    i = 0
    for tournament in tournaments.find({}, {"_id": 1, "name": 1}):
        matches.update_many({"tournamentId": tournament["_id"]}, 
                            {"$set": {"tournamentName": tournament["name"]}})
        if i % 30 == 0:
            print(f"Updated {i} Tournaments")
        i += 1
    return 


if __name__ == "__main__":
    load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")
    client = MongoClient(DATABASE_URL)
    db = client["test"]
    matches_db = db["Match"]
    tournaments_db = db["Tournament"]
    addTournamentName(matches_db, tournaments_db)