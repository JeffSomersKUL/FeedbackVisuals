import csv
import os
import reader.ConfigReader as ConfigReader

def writeQuestionnairesFile(questionnairesFilePath, config, questionnaires):
    columnMappers = [('vragenReeks', lambda key, val: key)]
    for questionId in ConfigReader.getAllQuestionIds(config):
        columnMappers.append(
            ('vraag' + str(questionId), (lambda questionId: lambda key, val: val[questionId])(questionId)))

    with open(questionnairesFilePath, 'w', newline='') as tsvfile:
        questionnairesWriter = csv.writer(tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        questionnairesWriter.writerow([cm[0] for cm in columnMappers])

        for key, value in questionnaires:
            questionnairesWriter.writerow(
                [cm[1](key, value) for cm in columnMappers])


def writeQuestionnaires(folderPath, config, questionnaires):
    print('Writing questionnaires')
    outputFolderPath = folderPath + '/_generated_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    questionnairesFilePath = outputFolderPath + '/vragenlijsten.tsv'
    writeQuestionnairesFile(questionnairesFilePath, config, questionnaires)


def writeFeedbackQuestionnaires(folderPath, config, questionnaires):
    print('Writing feedback questionnaires')
    outputFolderPath = folderPath + '/_feedback_platform_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    questionnairesFilePath = outputFolderPath + '/' + \
        str(config[ConfigReader.CONFIG_KEY_TEST_SESSION]) + '-' + \
        config[ConfigReader.CONFIG_KEY_TEST_CODE] + '-vragenlijsten.tsv'
    writeQuestionnairesFile(questionnairesFilePath, config, questionnaires)


def writeInputQuestionnaires(folderPath, config, questionnaires):
    print('Writing input questionnaires')
    questionnairesFilePath = folderPath + '/vragenlijsten.tsv'
    writeQuestionnairesFile(questionnairesFilePath, config, questionnaires)
