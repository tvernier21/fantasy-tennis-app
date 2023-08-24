from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
import os

import numpy as np
# import pandas as pd





def main():
    load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")
    client = MongoClient(DATABASE_URL)
    db = client["test"]
    #database
    tournaments_db = db["Tournament"]
    matches_db = db["Match"]
    players_db = db["Player"]

    print(matches_db.distinct('round'))

    # print("Starting Simulation")
    # # Get tournaments ordered by ascending date and greater than 2010
    # tournaments = list(tournaments_db.find({"date": {"$gt": datetime(2010, 1, 1)}}).sort("date", 1))
    
    # for tournament in tournaments:
    #     print(f"Running tournament: {tournament['name']}")
    #     tournament_id = tournament["_id"]
    #     matches = matches_db.find({"tournamentId": tournament_id})
    #     for match in matches:
    #         print(match)
    #     break

    client.close()
    return


main()