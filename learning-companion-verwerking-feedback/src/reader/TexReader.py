import os
import sys
import re
import reader.ConfigReader as ConfigReader

def readSolutions(folderPath, config):
    code = config[ConfigReader.CONFIG_KEY_TEST_CODE]
    if code == "ir":
        filepart = "SLEUTELreeks1"
    elif code in ["ew", "hw", "hi"]:
        filepart = "_key_"

    steutelFiles = [f for f in
                [os.path.join(folderPath, f)
                 for f in os.listdir(folderPath) if filepart in f]
                if os.path.isfile(f)]
    if len(steutelFiles) != 1:
        print(f'Error: no (or more than 1) {filepart} file found.')
        sys.exit(1)

    with open(folderPath + '/' + steutelFiles[0], 'r') as file:
        data = file.read()
        results = re.findall(
            r"\\begin{Oplossing}{(\d+)}\n\s*(.)\n\\end{Oplossing}", data, flags=re.S)
    print(results)
    if len(results) != len(ConfigReader.getAllQuestionIds(config)):
        print(f'Error: wrong amount of solutions in {filepart} file')
        sys.exit(1)


    return results 


def readQuestionnaires(folderPath, config):
    idFiles = [f for f in
            [os.path.join(folderPath, f)
                for f in os.listdir(folderPath) if "_IDreeks" in f]
            if os.path.isfile(f)]
    if len(idFiles) > 0:
        print('Found', len(idFiles), 'IDreeks files:', ','.join(idFiles))
    else:
        print('Error no IDreeks files found.')
        sys.exit(1)

    questionnaires = {}  # map with lists of (position, key) tuples
    for idFile in idFiles:
        nr = int(idFile[-5:-4])  # Only allows up to 9 questionnaires
        with open(folderPath + '/' + idFile, 'r') as file:
            data = file.read()
            lines = data.split('\n')
            nonEmptyLines = filter(lambda x: len(x) > 0, lines)
            results = list(enumerate(nonEmptyLines, 1))
            questionnaires[nr] = results

            if len(results) != len(ConfigReader.getAllQuestionIds(config)):
                print('ERROR: Wrong amount of questions in', idFile)
                sys.exit(1)

    keyToIdMapping = {}  # maps questionKey to questionId
    for questionId, questionKey in questionnaires[1]:
        keyToIdMapping[questionKey] = questionId

    mappedQuestionnaires = []  # list of tuples (questionnaireId, map questionId to position)
    for questionnaire, questions in questionnaires.items():
        mappedQuestionnaire = {}
        for questionPosition, questionKey in questions:
            questionId = keyToIdMapping[questionKey]
            mappedQuestionnaire[questionId] = questionPosition
        mappedQuestionnaires.append((questionnaire, mappedQuestionnaire))
    return mappedQuestionnaires

