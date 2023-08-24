"""
All Functions to calculate ELO
"""

# Importing dependencies
import numpy as np
import math
import re

# Declaring constants
K = {
    "sub-1700": 32,
    "1700-2000": 20,
    "above-2000": 10,
}

def result(score_str):
    # Returns a number between 0 and 1 that represents how close the match was
    # 0 means it was a blowout, 1 means it was a close match
    # score is a string of the score of the match
    penalty = False
    if "(RET)" in score_str or "(DEF)" in score_str:
        penalty = True

    score = re.sub(r'\(.*?\)', '', score_str).strip().split(" ")
    
    winner_games = 0
    loser_games = 0
    winner_sets = 0
    loser_sets = 0

    for set in score:
        winner_games += int(set.split("-")[0])
        loser_games += int(set.split("-")[1])
        if int(set.split("-")[0]) >= int(set.split("-")[1]):
            winner_sets += 1
        else:
            loser_sets += 1

    set_ratio = 1 - (loser_sets / (winner_sets + loser_sets))
    game_ratio = (loser_games / (winner_games + loser_games))

    correction = (set_ratio - .5) * (game_ratio / .6)
    actual =  set_ratio - correction
    # print(f"set ratio: {set_ratio}")
    # print(f"game ratio: {game_ratio}")
    # print(f"actual: {actual}")
    return actual, penalty


def expectedFiveSet(p3):
    # Probablity of winning in 3 sets, if x is the probabilty of winning 1 set
    # p3 = x^2 + 2(x^2*(1-x))
    #    = x^2 + 2x^2 - 2x^3
    # 0  = 2x^3 - 3x^2 + 0x - p3
    p1 = np.roots([-2, 3, 0, -1*p3])[1]
    # link to visualize graph
    # https://www6b3.wolframalpha.com/input?i=plot+0+%3D+-2x%5E3+%2B+3x%5E2+%2B+0x+-+.76+from+-1.5+to+1.5&lang=en
    p5 = p1**3 + 3*(p1**3*(1-p1)) + 6*(p1**3*(1-p1)**2)
    return p5


def expected(elo1, elo2, isFiveSet=False):
    # Returns a number between 0 and 1 that represents the odds of player 1 winning
    odds = 1 - (1 / (1 + math.pow(10, (elo1 - elo2) / 400)))
    if isFiveSet:
        odds = expectedFiveSet(odds)
    return odds


def eloChange(elo1, elo2, score_str, isFiveSet=False):
    player1_K = K["sub-1700"] if elo1 <= 1700 else K["above-2000"] if (elo1 >= 2000) else K["1700-2000"]
    player2_K = K["sub-1700"] if elo2 <= 1700 else K["above-2000"] if (elo2 >= 2000) else K["1700-2000"]
    expectedScore = expected(elo1, elo2, isFiveSet)
    actual, default = result(score_str)
    if default:
        player1_K = player1_K / 2
        player2_K = player2_K / 2

    player1_change = player1_K * (actual - expectedScore)
    player2_change = player2_K * (1 - actual - (1 - expectedScore))

    return player1_change, player2_change





if __name__ == "__main__":
    result("6-2 6-2")
    print()
    print(eloChange(2190, 2210, "6-4 6-4"))
    print()
    print(eloChange(1800, 2210, "6-4 6-4"))

