import reader.ConfigReader as ConfigReader


def calculateStatistics(config, allScores, metascores, questionnaires):
    amountOfParticipants = len(allScores)
    subScoreStatistics = {}
    metascoreStatistics = {}
    subScores = ConfigReader.getSubscores(config)
    for i in range(len(subScores)):
        subScoreName = subScores[i]
        subScoreStatistics[subScoreName] = calculateSubScoreStatistics(config, allScores.values(), subScoreName)
    metascoreNames = config[ConfigReader.CONFIG_KEY_METASCORES]
    for i in range(len(metascoreNames)):
        metascoreName = metascoreNames[i]
        metascoreStatistics[metascoreName] = calculateMetascoreStatistics(
            config, metascores, metascoreName)

    return {
        'amountOfParticipants': amountOfParticipants,
        'subScoreStatistics': subScoreStatistics,
        'metascoreStatistics': metascoreStatistics,
        'questionnaireSubScoreStatistics': calculateStatisticsByQuestionnaire(config, allScores.values(), questionnaires)
    }

def calculateStatisticsByQuestionnaire(config, scores, questionnaires):
    subScores = ConfigReader.getSubscores(config)
    questionnaireSubScoreStatistics = {}
    for q in questionnaires:
        subScoreStatistics = {}
        questionnaireScores = list(
            filter(lambda score: score[1] == q[0], scores))
        for i in range(len(subScores)):
            subScoreName = subScores[i]
        
            subScoreStatistics[subScoreName] = calculateSubScoreStatistics(
                config, questionnaireScores, subScoreName)
        questionnaireSubScoreStatistics[q[0]] = subScoreStatistics
    return questionnaireSubScoreStatistics

def calculateSubScoreStatistics(config, scores, subScoreName):  # subScore as arg
    subScoreScores = list(
        map(lambda score: score[0][subScoreName]['score'], scores))

    highestScore = max(subScoreScores)
    lowestScore = min(subScoreScores)
    meanScore = sum(subScoreScores) / len(subScoreScores)
    medianScore = sorted(subScoreScores)[len(subScoreScores)//2]

    amounts = {}
    for amount in range(ConfigReader.getSubscoreMaxScore(config, subScoreName) + 1):
        amounts[amount] = len(list(
            filter(lambda x: x == amount, subScoreScores)))

    return {
        'highest': highestScore,
        'lowest': lowestScore,
        'mean': meanScore,
        'median': medianScore,
        'scoreAmounts': amounts
    }


def calculateMetascoreStatistics(config, metascores, metascoreName):  # subScore as arg
    metaScores = list(
        map(lambda score: score[1][metascoreName], metascores))

    highestScore = max(metaScores)
    lowestScore = min(metaScores)
    meanScore = sum(metaScores) / len(metaScores)
    medianScore = sorted(metaScores)[len(metaScores)//2]

    amounts = {}
    for amount in range(ConfigReader.getSubscoreMaxScore(config, metascoreName) + 1):
        amounts[amount] = len(list(
            filter(lambda x: x == amount, metaScores)))

    return {
        'highest': highestScore,
        'lowest': lowestScore,
        'mean': meanScore,
        'median': medianScore,
        'scoreAmounts': amounts
    }
