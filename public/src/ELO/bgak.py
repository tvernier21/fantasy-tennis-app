from pymongo import MongoClient
from dotenv import load_dotenv
import os

import eloCalc


score = "6-3 6-3 6-3"
print(eloCalc.eloChange(wawr, djokovic, score, True))
print(eloCalc.eloChange(wawr, ruud, score, True))