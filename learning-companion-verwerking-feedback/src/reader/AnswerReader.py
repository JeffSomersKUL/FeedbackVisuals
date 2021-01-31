import os
import sys
import csv
import reader.ConfigReader as ConfigReader

def readCorrectAnswers(folderPath, config):
    correctAnswersFile = folderPath + '/juisteAntwoorden.tsv'
    print('Reading correct answers file:', correctAnswersFile)
    if not os.path.exists(correctAnswersFile):
        print('juisteAntwoorden file (' + correctAnswersFile + ') is missing')
        sys.exit(1)
    correctAnswers = []
    with open(correctAnswersFile, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        hasError = False
        for row in reader:
            try:
                correctAnswers.append((int(row['vraagId']), row['juisteAntwoord']))
            except:
                hasError = True
                print('Invalid vraagId', row['vraagId'])
    if hasError:
        sys.exit(1)
    validateCorrectAnswers(correctAnswers, config)
    return toAnswerMapping(correctAnswers)

# Local method
def validateCorrectAnswers(correctAnswers, config):
    hasError = False
    
    # Every vraagId should only appear once in the list 
    for a1 in correctAnswers:
        for a2 in correctAnswers:
            if (not a1 is a2) and a1[0] == a2[0]:
                hasError = True
                print('Question', a1[0], 'appears more than once in juisteAntwoorden')

    # Every vraagId should have a valid solution
    for vraagId in ConfigReader.getAllQuestionIds(config):
        answers = list(filter(lambda a: a[0] == vraagId, correctAnswers)) # Find correct answer for question
        if len(answers) == 0 :
            print('Missing correct answer for question', vraagId)
            hasError = True
        else:
            answer = answers[0]
            if answer[1] not in config[ConfigReader.CONFIG_KEY_ALL_ANSWER_OPTIONS]:
                print('Invalid correct answer for question', vraagId,':', answer[1])
                hasError = True


    if hasError:
        sys.exit(1)


# Local method
def toAnswerMapping(correctAnswers):
    d = {}
    for item in correctAnswers:
        d[item[0]] = item[1]
    return d


def readGeneratedMappedAnswers(folderPath, config):
    allMappedAnswersFile = folderPath + '/gemapte_antwoorden.tsv'
    print('Reading generated answers file:', allMappedAnswersFile)
    if not os.path.exists(allMappedAnswersFile):
        print('Answers file (' + allMappedAnswersFile +
              ') is missing, did you run the process script ?')
        sys.exit(1)
    allMappedAnswers = []
    with open(allMappedAnswersFile, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        for row in reader:
            ijkId = row['ijkID']
            questionnaireId = int(row['vragenReeks'])
            answers = {}
            for key in row:
                if key[:5] == 'vraag':
                    vraagId = key[5:]
                    answers[int(vraagId)] = row[key]
            allMappedAnswers.append((ijkId, answers, questionnaireId))
    return allMappedAnswers
