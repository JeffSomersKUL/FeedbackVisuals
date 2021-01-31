import os
import sys
import csv
import reader.ConfigReader as ConfigReader
import processor.ScoreProcessor as ScoreProcessor

def readGeneratedScores(folderPath, config):
    allScoresFile = folderPath + '/scores.tsv'
    print('Reading generated scores file:', allScoresFile)
    if not os.path.exists(allScoresFile):
        print('Scores file (' + allScoresFile +
              ') is missing, did you run the process script ?')
        sys.exit(1)
    allScores = []
    with open(allScoresFile, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        for row in reader:
            ijkId = row['ijkID']
            questionnaireId = int(row['vragenReeks'])
            passed = int(row['geslaagd']) == 1
            scores = {}

            for subScore in ConfigReader.getSubscores(config):
                scores[subScore] = ScoreProcessor.createSubScore(row[subScore+'Score'], row[subScore+'Juist'], row[subScore+'Fout'], row[subScore+'Blanco']) 
            allScores.append((ijkId, scores, questionnaireId, passed))
    return allScores
