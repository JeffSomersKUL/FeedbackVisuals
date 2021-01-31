import csv
import os
import sys
import reader.ConfigReader as ConfigReader
import generateFeedbackDataHelper as generateFeedbackDataHelper


def group_mapper(testCode, testSession, scores):
    if testSession == 17:
        if testCode in ["dw"]:
            if scores['totaal']['score'] >= 10:
                return 'A'
            elif 5 <= scores['totaal']['score'] <= 9:
                return 'B'
            else:
                return 'C'
    if testSession == 18:
        if testCode in ["dw"]:
            if scores['totaal']['score'] >= 10:
                return 'A'
            elif 5 <= scores['totaal']['score'] <= 9:
                return 'B'
            else:
                return 'C'
    if testSession == 19:
        if testCode in ["wb", "ew", "hw", "hi"]:
            return 'A'
        elif testCode in ["in", "ib","la", "bw"]:
            return 'A' if scores['totaal']['score'] >= 10 else 'B'
        elif testCode in ["fa"]:
            return 'A' if scores['zonder_basis']['score'] >= 10 else 'B'
    if testSession == 20:
        if testCode in ["ww"]:
            return 'A'
    raise 'Missing group mapper'

def writeResultsFile(folderPath, config, allScores, results_file_items):
    print('Writing results_file')
    outputFolderPath = folderPath + '/_generated_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    resultsFilePath = outputFolderPath + \
        f'/resultaatbestand-{config[ConfigReader.CONFIG_KEY_TEST_SESSION]}-{config[ConfigReader.CONFIG_KEY_TEST_CODE]}.csv'

    to_group = lambda scores: group_mapper(config[ConfigReader.CONFIG_KEY_TEST_CODE], config[ConfigReader.CONFIG_KEY_TEST_SESSION], scores)

    subscore_as_score = "totaal"
    if config[ConfigReader.CONFIG_KEY_TEST_CODE]=="fa":
        subscore_as_score = "zonder_basis"
    print(f"Using score {subscore_as_score} for main score field")

    columnMappers = [
        ('Naam', lambda key, val, o: ''), 
        ('Voornaam', lambda key, val, o: ''),
        ('nummer', lambda key, val, o: ijkID),
    ]
    if "onlineId" in results_file_items[0]:
        id_key = 'onlineId'
        columnMappers.append(('onlineID', lambda key, val, o: o))
    if "ijkId" in results_file_items[0]:
        id_key = 'ijkId'
        columnMappers.append(('ijkID', lambda key, val, o: o))
     
    columnMappers = columnMappers + [
        ('ijkingstoetssessie', lambda key, val, o: config[ConfigReader.CONFIG_KEY_TEST_SESSION]),
        ('FeedbackGroep', lambda key, val, o: to_group(val)),
        ('TOTAAL', lambda key, val, o: val[subscore_as_score]['score']),
        ('juist', lambda key, val, o: val[subscore_as_score]['amountRight']),
        ('fout',  lambda key, val, o: val[subscore_as_score]['amountWrong']),
        ('blanco', lambda key, val, o: val[subscore_as_score]['amountBlank'])
    ]

    subScores = list(filter(lambda s: s != subscore_as_score, ConfigReader.getSubscores(config)))
    for subScoreIndex in range(8):
        char = chr(ord("A") + subScoreIndex)
        if len(subScores) > subScoreIndex:
            subScore = subScores[subScoreIndex]
            print(f"Using score {subScore} for score{char}")
            columnMappers.append(('score' + char, (lambda subScore: lambda key,
                                                       val, o: val[subScore]['score'])(subScore)))
            columnMappers.append(
                ('juist' + char, (lambda subScore: lambda key, val, o: val[subScore]['amountRight'])(subScore)))
            columnMappers.append(
                ('fout' + char,  (lambda subScore: lambda key, val, o: val[subScore]['amountWrong'])(subScore)))
            columnMappers.append(('blanco'+char, (lambda subScore: lambda key,
                                                        val, o: val[subScore]['amountBlank'])(subScore)))
        else:
            columnMappers.append(('score' + char, lambda key,
                                                   val, o: ''))
            columnMappers.append(
                ('juist' + char, lambda key, val, o: ''))
            columnMappers.append(
                ('fout' + char,  lambda key, val, o: ''))
            columnMappers.append(('blanco'+char, lambda key,
                                                  val, o: ''))
    
    with open(resultsFilePath, 'w', newline='') as tsvfile:
        tsvfile.write("Alle Studenten"+','.join(map(lambda x: '', columnMappers)) + "\n") # Write strange first line
        resultsWriter = csv.writer(
            tsvfile, delimiter=',', quoting=csv.QUOTE_MINIMAL)

        # Writes header
        resultsWriter.writerow([cm[0] for cm in columnMappers])

        for ijkID, value, q, passed in allScores:
            onlineIds=list(
                filter(lambda item: item["nummer"] == ijkID, results_file_items))
            if len(onlineIds) == 0:
                print(f"Missing nummer {ijkID} in resultaatbestand")
                continue
            resultsWriter.writerow(
                [cm[1](ijkID, value, onlineIds[0][id_key]) for cm in columnMappers])
