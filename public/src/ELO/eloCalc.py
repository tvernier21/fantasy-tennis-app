"""
All Functions to calculate ELO
"""

# Importing dependencies
import numpy as np
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


def fiveSetOdds(p3):
    # Probablity of winning in 3 sets, if x is the probabilty of winning 1 set
    # p3 = x^2 + 2(x^2*(1-x))
    #    = x^2 + 2x^2 - 2x^3
    # 0  = 2x^3 - 3x^2 + 0x - p3
    p1 = np.roots([-2, 3, 0, -1*p3])
    # link to visualize graph
    # https://www6b3.wolframalpha.com/input?i=plot+0+%3D+-2x%5E3+%2B+3x%5E2+%2B+0x+-+.76+from+-1.5+to+1.5&lang=en

    p1 = p1[1]
    p5 = p1**3 + 3*(p1**3*(1-p1)) + 6*(p1**3*(1-p1)**2)
    return p5


def eloOdds(elo1, elo2, isFiveSet=False):
    # Returns a number between 0 and 1 that represents the odds of player 1 winning
    # elo1 is the elo of player 1
    # elo2 is the elo of player 2
    odds = 1 - (1 / (1 + math.pow(10, (elo1 - elo2) / 400)))
    if isFiveSet:
        odds = fiveSetOdds(odds)
    print(odds)
    return odds


if __name__ == "__main__":
    # matchTightness("7-6(2) 7-6(3)")
    odds = eloOdds(2000, 1800, True)

