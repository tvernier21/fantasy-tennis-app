"""
All Functions to calculate ELO
"""

# Importing dependencies
import numpy as np
import math
import re

# Declaring constants
# K = {
#     "sub-1700": 40,
#     "1700-2000": 20,
#     "above-2000": 10,
# }

def result(score_str, isFiveSet):
    # Returns a number between 0 and 1 that represents how close the match was
    # 0 means it was a blowout, 1 means it was a close match
    # score is a string of the score of the match
    if "(RET)" in score_str or "(DEF)" in score_str or "(W/O)" in score_str:
        return -1

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

    set_ratio = 1
    extra_correction = 1
    if isFiveSet and loser_sets == 2:
        set_ratio = .7
    elif isFiveSet and loser_sets == 1:
        set_ratio = .9
        extra_correction = .8
    elif not isFiveSet and loser_sets == 1:
        set_ratio = .75
    game_ratio = (loser_games / (winner_games + loser_games))

    # The most amount of games the loser can get is approx .6 of the total games
    # set_ratio can be .5 to 1, but really can only be .6, 66, .75 or 1
    # subtract from set ratio, up to .5, by the ratio of games the loser got
    # over the maximum amount of games the loser could have gotten
    correction = (set_ratio - .5) * (game_ratio / .6) * extra_correction
    result =  set_ratio - correction
    return result


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


def kFactorAdjustment(k, elo, difficulty):
    # Returns the k factor based on the elo of the player
    adj = 1 + (18 / (1 + 2**((elo - 1500) / 63)))
    tournament_adj = .8
    if difficulty == 4:
        tournament_adj = .9
    elif difficulty == 5:
        tournament_adj = 1
    return k * adj * tournament_adj


def eloChange(elo1, elo2, score_str, isFiveSet=False):
    expectedScore = expected(elo1, elo2, isFiveSet)
    matchResult = result(score_str, isFiveSet)
    if matchResult == -1:
        return 0, 0
    player1_K = kFactorAdjustment(32, elo1, isFiveSet)
    player2_K = kFactorAdjustment(32, elo2, isFiveSet)

    player1_change = player1_K * (matchResult - expectedScore)
    player2_change = player2_K * (1 - matchResult - (1 - expectedScore))

    return player1_change, player2_change


def absencePenalty(elo, match_date, last_match_date):
    adjustment = 0
    elo_adjust = 1
    if last_match_date is not None:
        months = (match_date - last_match_date).days / 30.436875
        if months >= 9:
            adjustment = 250
        elif months >= 6:
            adjustment = 150
        elif months >= 3:
            adjustment = 100

    if elo >= 2000:
        elo_adjust = .5
    elif elo >= 1700:
        elo_adjust = .75

    return elo - (adjustment * elo_adjust)


if __name__ == "__main__":
    result("6-2 6-2")
    print()
    print(eloChange(2190, 2210, "6-4 6-4"))
    print()
    print(eloChange(1800, 2210, "6-4 6-4"))

