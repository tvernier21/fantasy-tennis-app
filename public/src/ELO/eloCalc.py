"""
All Functions to calculate ELO
"""

# Importing dependencies
import math
import re

# Declaring constants
K = 32

def matchTightness(score_str):
    # Returns a number between 0 and 1 that represents how close the match was
    # 0 means it was a blowout, 1 means it was a close match
    # score is a string of the score of the match
    penalty = 1
    if "(RET)" in score_str or "(DEF)" in score_str:
        penalty = .8

    score = re.sub(r'\(.*?\)', '', score_str).strip().split(" ")
    print(score)
    
    winner_games = 0
    loser_games = 0

    for set in score:
        winner_games += int(set.split("-")[0])
        loser_games += int(set.split("-")[1])

    ratio = loser_games / winner_games 
    competitiveness = math.log10(ratio * 9 + 1) * penalty
    print(competitiveness)
    return competitiveness

if __name__ == "__main__":
    matchTightness("7-6(2) 7-6(3)")

