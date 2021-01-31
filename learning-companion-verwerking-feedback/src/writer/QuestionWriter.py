import csv
import os
import reader.ConfigReader as ConfigReader

def writeQuestionAnswers(folderPath, config, questionAnswers, correctAnswers):
    print('Writing question answers')
    outputFolderPath = folderPath + '/_generated_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    questionAnswerFilePath = outputFolderPath + '/vraag_antwoorden.tsv'

    columnMappers = [('vraagId', lambda key, val: key),
                     ('juisteAntwoord', lambda key, val: correctAnswers[key]),
                     ('aantalAntwoorden', lambda key,
                      val: val['amountOfAnswers']),
                     ('aantalJuist', lambda key, val: val['amountRight']),
                     ('aantalBlanco', lambda key, val: val['amountBlank'])]

    for answerOption in ConfigReader.getAllAnswerOptions(config):
        columnMappers.append(('aantal' + answerOption, (lambda answerOption: lambda key,
                                                        val: val['answers'][answerOption])(answerOption)))

    with open(questionAnswerFilePath, 'w', newline='') as tsvfile:
        questionAnswerWriter = csv.writer(
            tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        questionAnswerWriter.writerow([cm[0] for cm in columnMappers])

        for key, value in questionAnswers:
            questionAnswerWriter.writerow(
                [cm[1](key, value) for cm in columnMappers])


def writeFeedbackQuestionAnswers(folderPath, config, questionAnswers):
    print('Writing feedback question answers')
    outputFolderPath = folderPath + '/_feedback_platform_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    questionAnswerFilePath = outputFolderPath + '/' + \
        str(config[ConfigReader.CONFIG_KEY_TEST_SESSION]) + '-' + \
        config[ConfigReader.CONFIG_KEY_TEST_CODE] + '-vraagAntwoorden.tsv'

    columnMappers = [('vraagId', lambda key, val: key),
                     ('juisteAntwoord', lambda key, val: val['correctAnswer']),
                     ('aantalAntwoorden', lambda key,
                      val: val['amountOfAnswers']),
                     ('aantalJuist', lambda key, val: val['amountRight']),
                     ('percentageJuist', lambda key,
                      val: round(100 * val['amountRight'] / val['amountOfAnswers'])),
                     ('aantalBlanco', lambda key, val: val['amountBlank']),
                     ('percentageBlanco', lambda key, val: round(100*val['amountBlank'] // val['amountOfAnswers']))]

    for answerOption in ConfigReader.getAllAnswerOptions(config):
        columnMappers.append(('aantal' + answerOption, (lambda answerOption: lambda key,
                                                        val: val['answers'][answerOption])(answerOption)))

    with open(questionAnswerFilePath, 'w', newline='') as tsvfile:
        questionAnswerWriter = csv.writer(
            tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        questionAnswerWriter.writerow([cm[0] for cm in columnMappers])

        for key, value in questionAnswers:
            questionAnswerWriter.writerow(
                [cm[1](key, value) for cm in columnMappers])


def writeInputQuestionAnswers(folderPath, correctAnswers):
    print('Writing input question answers')
    questionAnswerFilePath = folderPath + '/juisteAntwoorden.tsv'

    columnMappers = [('vraagId', lambda key, val: key),
                     ('juisteAntwoord', lambda key, val: val)]

    with open(questionAnswerFilePath, 'w', newline='') as tsvfile:
        questionAnswerWriter = csv.writer(
            tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        questionAnswerWriter.writerow([cm[0] for cm in columnMappers])

        for key, value in correctAnswers:
            questionAnswerWriter.writerow(
                [cm[1](key, value) for cm in columnMappers])
