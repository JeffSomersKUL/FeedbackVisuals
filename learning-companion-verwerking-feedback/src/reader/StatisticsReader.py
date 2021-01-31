import os
import sys
import csv
import re
import reader.ConfigReader as ConfigReader
import processor.ScoreProcessor as ScoreProcessor


def readGeneratedStatistics(folderPath, config):
    statisticsFile = folderPath + '/statistieken.tsv'
    print('Reading generated statistics file:', statisticsFile)
    if not os.path.exists(statisticsFile):
        print('Statistics file (' + statisticsFile +
              ') is missing, did you run the process script ?')
        sys.exit(1)
    statistics = {
        'subScoreStatistics': {},
        'questionnaireSubScoreStatistics': {},
        'metascoreStatistics': {}
    }
    with open(statisticsFile, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        for row in reader:
            key = row['key']
            value = row['value']

            if(key == 'aantalDeelnemers'):
                statistics['amountOfParticipants'] = int(value)
                 
            
            questionnaireMatch = re.search(r"vragenreeks(\d+)(.*)", key)
            if questionnaireMatch:
                questionnaireId, s = questionnaireMatch.group(1, 2)
                questionnaireId = int(questionnaireId)
                if questionnaireId not in statistics['questionnaireSubScoreStatistics']:
                    statistics['questionnaireSubScoreStatistics'][questionnaireId] = {}
                itemToChange = statistics['questionnaireSubScoreStatistics'][questionnaireId]
            else:
                itemToChange = "other"
                s = key
            
            subScoreAndTypeData = findSubScoreAndType(s)
            if subScoreAndTypeData is not None:
                type, subScoreName = subScoreAndTypeData[0:2]
                if itemToChange == "other":
                    if subScoreName in config[ConfigReader.CONFIG_KEY_SUBSCORES]:
                        itemToChange = statistics['subScoreStatistics']
                    elif subScoreName in config[ConfigReader.CONFIG_KEY_METASCORES]:
                        itemToChange = statistics['metascoreStatistics']

                if subScoreName not in itemToChange:
                    itemToChange[subScoreName] = {}
                
                if type != 'scoreAmounts':
                    itemToChange[subScoreName][type] = float(value) if type == 'mean' else int(value)
                else:
                    if 'scoreAmounts' not in itemToChange[subScoreName]:
                        itemToChange[subScoreName]['scoreAmounts'] = {}
                    itemToChange[subScoreName]['scoreAmounts'][int(subScoreAndTypeData[2])] = int(value)

    return statistics

def findSubScoreAndType(s):
    highestScoreMatch = re.search(r"(.*)HoogsteScore", s)
    if(highestScoreMatch):
        return ('highest', highestScoreMatch.group(1))
    laagsteScoreMatch = re.search(r"(.*)LaagsteScore", s)
    if(laagsteScoreMatch):
        return ('lowest', laagsteScoreMatch.group(1))
    meanScoreMatch = re.search(r"(.*)GemiddeldeScore", s)
    if(meanScoreMatch):
        return ('mean', meanScoreMatch.group(1))
    medianScoreMatch = re.search(r"(.*)MediaanScore", s)
    if(medianScoreMatch):
        return ('median', medianScoreMatch.group(1))
    
    amountScoreMatch = re.search(r"(.*)AantalScore(\d+)", s)
    if(amountScoreMatch):
        return ('scoreAmounts', amountScoreMatch.group(1), int(amountScoreMatch.group(2)))

    return None
