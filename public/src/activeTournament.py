from bs4 import BeautifulSoup, Comment
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import time
import random
from bson.objectid import ObjectId

from initScraper import init_driver


def activateTournamentPlayers(LINK, tournament, players_db, tournamentPlayers_db):
    driver = init_driver()
    driver.get(LINK)
    while driver.execute_script("return document.readyState") != "complete":
        pass
    soup = BeautifulSoup(driver.page_source, "html.parser")

    first_rounds = soup.find('table', {'class': 'scores-draw-table'}).tbody.find_all('tr')
    for first_round in first_rounds:
        players_box = first_round.td.find_all('tr')
        for player_box in players_box:
            name = player_box.find('a').get_text(strip=True)
            player = players_db.find_one({"name": name})
            if player is None:
                player_link = "https://www.atptour.com" + player_box.find('a')['href']
                player_driver = init_driver()
                player_driver.get(player_link)
                while player_driver.execute_script("return document.readyState") != "complete":
                    pass
                player_soup = BeautifulSoup(player_driver.page_source, "html.parser")
                player_name = player_soup.find('div', {'class': 'player-profile-hero-name'})
                first_name = player_name.find('div', {'class': 'first-name'}).get_text(strip=True)
                last_name = player_name.find('div', {'class': 'last-name'}).get_text(strip=True)
                name = first_name + " " + last_name

                player = players_db.find_one({"name": name})
                if player is None:
                    print("REEEEE")
                    break

                player_driver.close()
            
            tournamentPlayer = {
                "playerId": player['_id'],
                "tournamentId": tournament['_id'],
                "name": player['name'],
                "elo": player['elo'],
                "points": 0,
                "active": True,
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
            tournamentPlayers_db.insert_one(tournamentPlayer)

    driver.close()


def activateTournamentTeams(tournament, teams_db, userLeague_db):
    activeUsers = userLeague_db.find({})
    for activeUser in activeUsers:
        user_id = activeUser['userId']
        league_id = activeUser['leagueId']
        tournament_id = tournament['_id']

        # Check if there's an existing team for the activeUser and tournament
        existing_team = teams_db.find_one({
            'userId': user_id,
            'leagueId': league_id,
            'tournamentId': tournament_id
        })

        # If there's no existing team, create a new one
        if not existing_team:
            new_team = {
                'userId': user_id,
                'leagueId': league_id,
                'tournamentId': tournament_id,
                'points': 0,
                'budget': 8000,
                'teamCapacity': 5,
                'createdAt': datetime.now(),
                'updatedAt': datetime.now()
            }
            teams_db.insert_one(new_team)
            print("creating new team")

                            



if __name__ == "__main__":
    LINK = "https://www.atptour.com/en/scores/current/us-open/560/draws"
    TOURNAMENT_ID = "64e3f9d12d77fc1e69061767"

    load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")
    client = MongoClient(DATABASE_URL)
    db = client["test"]
    #database
    tournaments_db = db["Tournament"]
    players_db = db["Player"]
    tournamentPlayers_db = db["TournamentPlayer"]

    tournament = tournaments_db.find_one({"_id": ObjectId(TOURNAMENT_ID)})

    tournamentPlayers_db.delete_many({})
    activateTournamentPlayers(LINK, tournament, players_db, tournamentPlayers_db)
    
    # userLeague_db = db["UserLeague"]
    # teams_db = db["Team"]
    # activateTournamentTeams(tournament, teams_db, userLeague_db)

    client.close()
