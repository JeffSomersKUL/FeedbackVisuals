import csv
import os
import reader.ConfigReader as ConfigReader

def writeAllMappedAnswersFile(allMappedAnswersFilePath, config, allMappedAnswers, keyName):
    columnMappers = [(keyName, lambda key, val, questionnaireId: key),
                     ('vragenReeks', lambda key, val, questionnaireId: questionnaireId)]
    for questionId in ConfigReader.getAllQuestionIds(config):
        columnMappers.append(
            ('vraag' + str(questionId), (lambda questionId: lambda key, val, questionnaireId: val[questionId])(questionId)))

    with open(allMappedAnswersFilePath, 'w', newline='') as tsvfile:
        mappedAnswersWriter = csv.writer(
            tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        mappedAnswersWriter.writerow([cm[0] for cm in columnMappers])

        for key, value, questionnaireId in allMappedAnswers:
            mappedAnswersWriter.writerow(
                [cm[1](key, value, questionnaireId) for cm in columnMappers])

def writeAllMappedAnswers(folderPath, config, allMappedAnswers):
    print('Writing all mapped answers')
    outputFolderPath = folderPath + '/_generated_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    allMappedAnswersFilePath = outputFolderPath + '/gemapte_antwoorden.tsv'
    writeAllMappedAnswersFile(allMappedAnswersFilePath,
                              config, allMappedAnswers, 'ijkID')


def writeFeedbackAllMappedAnswers(folderPath, config, allMappedAnswers):
    print('Writing feedback all mapped answers')
    outputFolderPath = folderPath + '/_feedback_platform_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    allMappedAnswersFilePath = outputFolderPath + '/' + \
        str(config[ConfigReader.CONFIG_KEY_TEST_SESSION]) + '-' + \
        config[ConfigReader.CONFIG_KEY_TEST_CODE] + '-antwoorden.tsv'

    writeAllMappedAnswersFile(allMappedAnswersFilePath,
                              config, allMappedAnswers, 'feedbackCode')


def writeCorrectAnswers(folderPath, config, correctAnswers):
    correctAnswersFile = folderPath + '/juisteAntwoorden.tsv'
    print('Writing correct answers file:', correctAnswersFile)
    
    columnMappers = [('vraagId', lambda key, val: key),
                     ('juisteAntwoord', lambda key, val: val), ]
  
    with open(correctAnswersFile, 'w', newline='') as tsvfile:
        correctAnswersWriter = csv.writer(
            tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        correctAnswersWriter.writerow([cm[0] for cm in columnMappers])
        for key, value in correctAnswers:
            correctAnswersWriter.writerow(
                [cm[1](key, value) for cm in columnMappers])
