import os
import sys
import csv
import reader.ConfigReader as ConfigReader

def readGeneratedQuestionAnswers(folderPath, config):
    questionAnswersFile = folderPath + '/vraag_antwoorden.tsv'
    print('Reading generated question answers file:', questionAnswersFile)
    if not os.path.exists(questionAnswersFile):
        print('Question answers file (' + questionAnswersFile +
              ') is missing, did you run the process script ?')
        sys.exit(1)
    allQuestionAnswers = []
    with open(questionAnswersFile, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        for row in reader:
            questionId = int(row['vraagId'])
            questionAnswers = {
                'correctAnswer': row['juisteAntwoord'],
                'amountOfAnswers': int(row['aantalAntwoorden']),
                'amountRight':	int(row['aantalJuist']),
                'amountBlank': int(row['aantalBlanco']),
                'answers': {}		
            }
            for answerOption in ConfigReader.getAllAnswerOptions(config):
                questionAnswers['answers'][answerOption] = row['aantal'+answerOption]
            allQuestionAnswers.append((questionId, questionAnswers))
    return allQuestionAnswers
