import os
import sys
import csv
import reader.ConfigReader as ConfigReader
import processor.ScoreProcessor as ScoreProcessor

def readMetascores(folderPath, config):
    if len(config[ConfigReader.CONFIG_KEY_METASCORES]) == 0:
        return []
        
    allMetascoresFile = folderPath + '/metascores.csv'
    print('Reading metascores file:', allMetascoresFile)
    if not os.path.exists(allMetascoresFile):
        print('Metascores file (' + allMetascoresFile + ') is missing')
        sys.exit(1)
    allMetascores = []
    with open(allMetascoresFile, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for row in reader:
            ijkId = row['IjkID']
            scores = {}

            for metascore in config[ConfigReader.CONFIG_KEY_METASCORES]:
                if row[metascore] == ' ': #missing value...
                    row[metascore] = "0" # str(config[ConfigReader.CONFIG_KEY_SUBSCORE_MAXSCORE(metascore)] / 2)
                    print(f"MISSING VALUE FOR {metascore}, setting to {row[metascore]}")

                scores[metascore] = ScoreProcessor.roundFunction(float(row[metascore].replace(",",".")))
            allMetascores.append((ijkId, scores))
    return allMetascores

def readGeneratedMetascores(folderPath, config):
    if len(config[ConfigReader.CONFIG_KEY_METASCORES]) == 0:
        return []

    allMetascoresFile = folderPath + '/metascores.tsv'
    print('Reading generated metascores file:', allMetascoresFile)
    if not os.path.exists(allMetascoresFile):
        print('Metascores file (' + allMetascoresFile +
              ') is missing, did you run the process script ?')
        sys.exit(1)
    allMetascores = []
    with open(allMetascoresFile, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        for row in reader:
            ijkId = int(row['ijkID'])
            scores = {}

            for metascore in config[ConfigReader.CONFIG_KEY_METASCORES]:
                scores[metascore] = row[metascore+'Score'] 
            allMetascores.append((ijkId, scores))
    return allMetascores
