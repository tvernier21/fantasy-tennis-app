from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
from datetime import datetime
import os


def updateActive(tournaments, activeId):
    tournaments.update_many({}, {"$set": {
        "active": False,
        "started": False,
        "updatedAt": datetime.now()
    }})
    tournaments.update_one({"_id": ObjectId(activeId)}, {"$set": {
        "active": True,
        "started": True,
    }})
    return

def updateLinks(tournaments, activeId, links):
    tournaments.update_one({"_id": ObjectId(activeId)}, {"$set": {
        "links": links,
        "updatedAt": datetime.now()
    }})
    return


if __name__ == "__main__":
    load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")
    client = MongoClient(DATABASE_URL)
    db = client["test"]
    tournaments_db = db["Tournament"]
    
    ACTIVE_ID = "64e3f9d12d77fc1e69061767"
    updateActive(tournaments_db, ACTIVE_ID)