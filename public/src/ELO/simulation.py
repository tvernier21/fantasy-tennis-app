from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
import os

import eloCalc


rounds = [
    '1st Round Qualifying', 
    '2nd Round Qualifying', 
    '3rd Round Qualifying', 
    'Round Robin', 
    'Round of 128', 
    'Round of 64', 
    'Round of 32', 
    'Round of 16', 
    '3rd/4th Place Match', 
    'Quarterfinals', 
    'Quarter-Finals', 
    'Semi-Finals', 
    'Semifinals',
    'Olympic Bronze', 
    'Final', 
    'Finals'
]
banned_rounds = ['International Jr Event', 'Wheelchair', 'Champions Tour']



def main():
    k = [20, 30, 40, 50, 60, 70]
    for k_factor in k:
        load_dotenv()
        DATABASE_URL = os.getenv("DATABASE_URL")
        client = MongoClient(DATABASE_URL)
        db = client["test"]
        #database
        tournaments_db = db["Tournament"]
        matches_db = db["Match"]
        players_db = db["Player"]

        players_db.update_many({}, {
            "$set": {
                "elo": 1500,
                "yelo": 1500,
                "hard_elo": 1500,
                "clay_elo": 1500,
                "grass_elo": 1500,
                "lastMatch": None,
                "numMatches": 0
                }
        })

        print("Starting Simulation")
        # Get tournaments ordered by ascending date and greater than 2010
        tournaments = list(tournaments_db.find({"date": 
                                                {"$gt": datetime(2022, 8, 25),
                                                "$lt": datetime(2023, 8, 25)}}).sort("date", 1))
        
        for tournament in tournaments:
            # print(f"Running tournament: {tournament['name']}")
            tournament_id = tournament["_id"]
            surface = tournament["surface"]
            difficulty = tournament["difficulty"]
            isFiveSet = False
            if difficulty == 5:
                isFiveSet = True

            # Get all matches from tournament ordered by round
            pipeline = [
                {
                    "$match": {"tournamentId": tournament_id}
                },
                {
                    "$addFields": {
                        "orderIndex": {"$indexOfArray": [rounds, "$round"]}
                    }
                },
                {
                    "$sort": {"orderIndex": 1}
                }
            ]

            matches = list(matches_db.aggregate(pipeline))
            for match in matches:
                if match["round"] in banned_rounds:
                    continue

                winner = players_db.find_one({"_id": match["winnerId"]})
                loser = players_db.find_one({"_id": match["loserId"]})


                winner_elo = winner["elo"]
                loser_elo = loser["elo"]
                if "Qualifying" in match["round"]:
                    if winner["numMatches"] == 0:
                        winner_elo = 1300
                    if loser["numMatches"] == 0:
                        loser_elo = 1300


                # Adjust elo based on absence
                winner_elo = eloCalc.absencePenalty(winner_elo, match["date"], winner["lastMatch"])
                loser_elo = eloCalc.absencePenalty(loser_elo, match["date"], loser["lastMatch"])
                
                # Calculate elo change
                score = match["score"]
                winner_change, loser_change = eloCalc.eloChange(winner_elo, 
                                                                loser_elo, 
                                                                score,
                                                                isFiveSet,
                                                                k_factor)

                # Update elo
                new_winner_elo = winner_elo + winner_change
                new_loser_elo = loser_elo + loser_change
                players_db.update_one({"_id": winner["_id"]}, {"$set": {"elo": new_winner_elo,
                                                                        "lastMatch": match["date"]},
                                                            "$inc": {"numMatches": 1}})
                players_db.update_one({"_id": loser["_id"]}, {"$set": {"elo": new_loser_elo,
                                                                        "lastMatch": match["date"]},
                                                            "$inc": {"numMatches": 1}})

                # if match["round"] in rounds[-7:]:
                # if difficulty >= 4:
                #     print(match['round'])
                #     print(f'{winner["name"]} def. {loser["name"]} ({score})')
                #     print(f'({winner_elo} => {new_winner_elo}) | ({loser_elo} => {new_loser_elo})')
                #     print()


        print(f"Simulation Complete for k={k_factor}")
        players_bgak = list(players_db.find({"numMatches": {"$gt": 30}}).sort("elo", -1))
        for i, player_bgak in enumerate(players_bgak[:50]):
            print(f'{i+1}. {player_bgak["name"]} ({player_bgak["elo"]})')
        client.close()
        


main()