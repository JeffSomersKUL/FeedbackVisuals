import os
import sys
import csv
import reader.ConfigReader as ConfigReader

def readQuestionnaires(folderPath, config):
    questionnairesFile = folderPath + '/vragenlijsten.tsv'
    print('Reading questionnaires file:', questionnairesFile)
    if not os.path.exists(questionnairesFile):
        print('Config file (' + questionnairesFile + ') is missing')
        sys.exit(1)
    questionnaires = []
    with open(questionnairesFile, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        hasError = False
        for row in reader:
            try:
                questionnaire = int(row['vragenReeks'])
            except:
                print('Questionnaire', row['vragenReeks'], 'is invalid, should be an int.')
                sys.exit(1)
            positionMapping = {}
            for key in row:
                if key[:5] == 'vraag':
                    try:
                        vraagId = key[5:]
                        positionMapping[int(vraagId)] = int(row[key])   
                    except:
                        hasError = True
                        print('Error for questionnaire', questionnaire, 'at column', key)
            questionnaires.append((questionnaire, positionMapping))
    if hasError:
        sys.exit(1)
    validateQuestionnaires(questionnaires, config)
    return questionnaires

# Local method
def validateQuestionnaires(questionnaires, config):
    hasError = False
    
    # Questionnaires should be different 
    for q1 in questionnaires:
        for q2 in questionnaires:
            if q1[0] != q2[0] and q1[1] == q2[1]:
                hasError = True
                print('Questionnaires', q1[0], 'and', q2[0], 'are equal')

    if len(questionnaires) == 0:
        hasError = True
        print('There should be at least one questionnaire')
    else:
        # Questionnaires should contains valid vraagIds
        for vraagId, position in questionnaires[0][1].items():
            if not (1 <= vraagId <= config[ConfigReader.CONFIG_KEY_AMOUNT_QUESTIONS]):
                hasError = True
                print('The questionnaires contain a question with a vraagId',vraagId, 'that is not between 1 and', config[ConfigReader.CONFIG_KEY_AMOUNT_QUESTIONS])

        # Questionnaires should contains valid positions
        for q in questionnaires:
            for vraagId, position in q[1].items():
                if not (1 <= position <= config[ConfigReader.CONFIG_KEY_AMOUNT_QUESTIONS]):
                    hasError = True
                    print('Questionnaire', q[0], 'places vraag' + str(vraagId), 'at position', position,
                          ' which is not between 1 and', config[ConfigReader.CONFIG_KEY_AMOUNT_QUESTIONS])

        # Questionnaires should not have duplicate positions
        for q in questionnaires:
            positions = [i[1] for i in q[1].items()]
            if len(positions) != len(set(positions)):
                hasError = True
                print('Questionnaire', q[0], 'has duplicate positions ')

    if hasError:
        sys.exit(1)


def readGeneratedQuestionnaires(folderPath, config):
    questionnairesFile = folderPath + '/vragenlijsten.tsv'
    print('Reading generated questionnaires file:', questionnairesFile)
    if not os.path.exists(questionnairesFile):
        print('Questionnaires file (' + questionnairesFile +
              ') is missing, did you run the process script ?')
        sys.exit(1)
    questionnaires = []
    with open(questionnairesFile, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        for row in reader:
            questionnaire = int(row['vragenReeks'])
            positionMapping = {}
            for key in row:
                if key[:5] == 'vraag':
                    vraagId = key[5:]
                    positionMapping[int(vraagId)] = int(row[key])
            questionnaires.append((questionnaire, positionMapping))
    validateQuestionnaires(questionnaires, config)
    return questionnaires
