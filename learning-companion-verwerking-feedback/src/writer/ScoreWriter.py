import csv
import os
import reader.ConfigReader as ConfigReader
import generateFeedbackDataHelper as generateFeedbackDataHelper

def writeAllScores(folderPath, config, allScores):
    print('Writing all scores')
    outputFolderPath = folderPath + '/_generated_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    allScoresFilePath = outputFolderPath + '/scores.tsv'

    columnMappers = [('ijkID', lambda key, val: key), ('vragenReeks', lambda key, val: val[1]),
                     ('geslaagd', lambda key, val: 1 if val[2] else 0)]
    for subScore in ConfigReader.getSubscores(config):
        columnMappers.append(
            (subScore + 'Juist', (lambda subScore: lambda key, val: val[0][subScore]['amountRight'])(subScore)))
        columnMappers.append(
            (subScore + 'Fout',  (lambda subScore: lambda key, val: val[0][subScore]['amountWrong'])(subScore)))
        columnMappers.append((subScore + 'Blanco', (lambda subScore: lambda key,
                                                    val: val[0][subScore]['amountBlank'])(subScore)))
        columnMappers.append((subScore + 'Score', (lambda subScore: lambda key,
                                                   val: val[0][subScore]['score'])(subScore)))

    with open(allScoresFilePath, 'w', newline='') as tsvfile:
        scoresWriter = csv.writer(tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        scoresWriter.writerow([cm[0] for cm in columnMappers])

        for key, value in allScores.items():
            scoresWriter.writerow([cm[1](key, value) for cm in columnMappers])


def writeFeedbackAllScores(folderPath, config, allScores, allMetascores):
    print('Writing feedback all scores')
    outputFolderPath = folderPath + '/_feedback_platform_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    allScoresFilePath = outputFolderPath + '/' + str(config[ConfigReader.CONFIG_KEY_TEST_SESSION]) + '-' + config[ConfigReader.CONFIG_KEY_TEST_CODE] + '-scores.tsv'

    columnMappers = [('feedbackCode', lambda key, val, questionnaireId, passed, metascore: key),
                     ('vragenReeks', lambda key, val, questionnaireId,
                      passed, metascore: questionnaireId),
                     ('geslaagd', lambda key, val, questionnaireId, passed, metascore: 1 if passed else 0)]

    for subScore in ConfigReader.getSubscores(config):
        columnMappers.append(
            (subScore + 'Juist', (lambda subScore: lambda key, val, questionnaireId, passed, metascore: val[subScore]['amountRight'])(subScore)))
        columnMappers.append(
            (subScore + 'Fout',  (lambda subScore: lambda key, val, questionnaireId, passed, metascore: val[subScore]['amountWrong'])(subScore)))
        columnMappers.append((subScore + 'Blanco', (lambda subScore: lambda key,
                                                    val, questionnaireId, passed, metascore: val[subScore]['amountBlank'])(subScore)))
        columnMappers.append((subScore + 'Score', (lambda subScore: lambda key,
                                                   val, questionnaireId, passed, metascore: val[subScore]['score'])(subScore)))
        columnMappers.append((subScore + 'Groep', (lambda subScore: lambda key,
                                                   val, questionnaireId, passed, metascore: val[subScore]['groupLabel'])(subScore)))
    # Also write metascores as subscores
    for metascore in config[ConfigReader.CONFIG_KEY_METASCORES]:
        columnMappers.append((metascore + 'Score', (lambda metascore: lambda key,
                                                    val, questionnaireId, passed, metascores: metascores.get(metascore, 0))(metascore)))

    with open(allScoresFilePath, 'w', newline='') as tsvfile:
        scoresWriter = csv.writer(
            tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        scoresWriter.writerow([cm[0] for cm in columnMappers])

        for key, value, questionnaireId, passed in allScores:
            metascore = {}
            metascore_vals = list(filter(lambda x: x[0] == key, allMetascores))
            if len(metascore_vals) == 1:
                metascore = metascore_vals[0][1]
            scoresWriter.writerow([cm[1](key, value, questionnaireId, passed, metascore) for cm in columnMappers])

def writeFeedbackPeerScores(folderPath, config, peerScores, groupColorMapping):
    print('Writing feedback peer scores')
    outputFolderPath = folderPath + '/_feedback_platform_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    peerScoresFilePath = outputFolderPath + '/' + \
        str(config[ConfigReader.CONFIG_KEY_TEST_SESSION]) + '-' + \
        config[ConfigReader.CONFIG_KEY_TEST_CODE] + '-peerScores.tsv'

    with open(peerScoresFilePath, 'w', newline='') as tsvfile:
        peerScoresWriter = csv.writer(
            tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        peerScoresWriter.writerow(['scoreNaam', 'groepLabel', 'kleur', 'aantal'])             

        for subScore, groups in peerScores.items():
            
            # Fix order
            groupsCalculators = generateFeedbackDataHelper.getGroupCalculators(
                config[ConfigReader.CONFIG_KEY_TEST_CODE], config[ConfigReader.CONFIG_KEY_TEST_SESSION], subScore)
            orderedGroups = list(map(lambda g: g[1], groupsCalculators))
            mapping = dict(list(map(lambda x: (x[1], x[0]), enumerate(orderedGroups))))
            sortedGroups = sorted(groups.items(), key=lambda x: mapping.get(x[0]))

            for group, amount in sortedGroups:
                peerScoresWriter.writerow([subScore, group, groupColorMapping[subScore][group], amount])
