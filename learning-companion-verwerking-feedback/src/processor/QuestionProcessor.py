import reader.ConfigReader as ConfigReader


def calculateQuestionStatistics(config, allMappedAnswers, correctAnswers):
    print('Calculating question statistics')
    questions = []
    for questionId in ConfigReader.getAllQuestionIds(config):
        answerAmounts = {}
        for answerOption in ConfigReader.getAllAnswerOptions(config) + ['X']:
            answerAmounts[answerOption] = len(
                [1 for participant in allMappedAnswers if participant[1][questionId] == answerOption])
        amountOfAnswers = sum([amount for option, amount in answerAmounts.items()])
        amountBlank = answerAmounts['X']
        amountRight = answerAmounts[correctAnswers[questionId]]
        percentageRight = round(100.0 * amountRight / amountOfAnswers) # TODO choose rounding ?
        percentageBlank = round(100.0 * amountBlank / amountOfAnswers) # TODO choose rounding ?
        
        questions.append((questionId, {
            'amountOfAnswers': amountOfAnswers,
            'amountRight': amountRight,
            'amountBlank': amountBlank,
            'percentageRight': percentageRight,
            'percentageBlank': percentageBlank,
            'answers': answerAmounts
        }))


    return questions



