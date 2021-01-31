import reader.ConfigReader as ConfigReader
import math
import processHelper as processHelper

def calculateAllScores(config, allMappedAnswers, correctAnswers):
    print('Calculating all scores')
    allScores = {}
    for ijkId, mappedAnswers, questionnaireId in allMappedAnswers:
        scores = {}
        for subScore in ConfigReader.getSubscores(config):
            scores[subScore] = calculateSubScore(subScore, config, mappedAnswers, correctAnswers)
        passed = processHelper.isPassingScore(
            config[ConfigReader.CONFIG_KEY_TEST_CODE], config[ConfigReader.CONFIG_KEY_TEST_SESSION], scores)
        allScores[ijkId] = (scores, questionnaireId, passed)
    return allScores

def createSubScore(score, amountRight, amountWrong, amountBlank):
    return {
        'score': int(score),
        'amountRight': int(amountRight),
        'amountWrong': int(amountWrong),
        'amountBlank': int(amountBlank)
    }


# x.5 up instead of to nearest integer of round()
def roundFunction(x):
    return math.floor(round(x, 6) + 0.5)

def calculateSubScore(subScore, config, mappedAnswers, correctAnswers):
    questions = ConfigReader.getSubscoreQuestionIds(config, subScore)
    questionScores = list(map(lambda q: calculateQuestionScore(
        mappedAnswers[q], correctAnswers[q], config[ConfigReader.CONFIG_KEY_FORMULA_SCORING_REDUCTION]), questions))

    totalScore = sum(questionScores)
    maxScore = ConfigReader.getSubscoreMaxScore(config, subScore)

    score = (totalScore / len(questions)) * maxScore

    roundedScore = max(0, roundFunction(score)) # Negative scores mapped to 0
    amountRight = len([s for s in questionScores if s > 0.99]) # > 0.99 instead of == 1 for robustness 
    amountWrong = len([s for s in questionScores if s < -0.01]) # < -0.01 instead of < 0 for robustness
    amountBlank = len(questions) - amountRight - amountWrong
    
    return createSubScore(roundedScore, amountRight, amountWrong, amountBlank)

def calculateQuestionScore(givenAnswer, correctAnswer, errorPenalty):
    if givenAnswer == correctAnswer:
        return 1
    if givenAnswer == 'X':
        return 0
    return -errorPenalty
