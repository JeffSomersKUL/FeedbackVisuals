import csv
import os
import reader.ConfigReader as ConfigReader

def writeStatistics(folderPath, config, statistics):
    print('Writing statistics')
    outputFolderPath = folderPath + '/_generated_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    statisticsFilePath = outputFolderPath + '/statistieken.tsv'

    rows = [['aantalDeelnemers', statistics['amountOfParticipants']]]
    for subScore, stats in statistics['subScoreStatistics'].items():
        rows.append([subScore + 'HoogsteScore', stats['highest']])
        rows.append([subScore + 'LaagsteScore', stats['lowest']])
        rows.append([subScore + 'GemiddeldeScore', stats['mean']])
        rows.append([subScore + 'MediaanScore', stats['median']])
        for score, amount in stats['scoreAmounts'].items():
            rows.append([subScore + 'AantalScore' + str(score), amount])
    
    for questionnaireId, questionnaireStats in statistics['questionnaireSubScoreStatistics'].items():
        for subScore, stats in questionnaireStats.items():
            rows.append(['vragenreeks' + str(questionnaireId) + subScore + 'HoogsteScore', stats['highest']])
            rows.append(['vragenreeks' + str(questionnaireId) +
                         subScore + 'LaagsteScore', stats['lowest']])
            rows.append(['vragenreeks' + str(questionnaireId) +
                         subScore + 'GemiddeldeScore', stats['mean']])
            rows.append(['vragenreeks' + str(questionnaireId) +
                         subScore + 'MediaanScore', stats['median']])
            for score, amount in stats['scoreAmounts'].items():
                rows.append(['vragenreeks' + str(questionnaireId) +
                             subScore + 'AantalScore' + str(score), amount])

    for metascore, stats in statistics['metascoreStatistics'].items():
        rows.append([metascore + 'HoogsteScore', stats['highest']])
        rows.append([metascore + 'LaagsteScore', stats['lowest']])
        rows.append([metascore + 'GemiddeldeScore', stats['mean']])
        rows.append([metascore + 'MediaanScore', stats['median']])
        for score, amount in stats['scoreAmounts'].items():
            rows.append([metascore + 'AantalScore' + str(score), amount])

    with open(statisticsFilePath, 'w', newline='') as tsvfile:
        statisticsWriter = csv.writer(
            tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Write header
        statisticsWriter.writerow(['key', 'value'])

        # Write rows
        for row in rows:
            statisticsWriter.writerow(row)

def writeFeedbackStatistics(folderPath, config, statistics):
    print('Writing feedback statistics')
    outputFolderPath = folderPath + '/_feedback_platform_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    statisticsFilePath = outputFolderPath + '/' + \
        str(config[ConfigReader.CONFIG_KEY_TEST_SESSION]) + '-' + \
        config[ConfigReader.CONFIG_KEY_TEST_CODE] + '-statistieken.tsv'

    rows = [['aantalDeelnemers', statistics['amountOfParticipants']]]
    for subScore, stats in statistics['subScoreStatistics'].items():
        rows.append([subScore + 'HoogsteScore', stats['highest']])
        rows.append([subScore + 'LaagsteScore', stats['lowest']])
        rows.append([subScore + 'GemiddeldeScore', round(stats['mean'], 2)])
        rows.append([subScore + 'MediaanScore', stats['median']])
        for score, amount in stats['scoreAmounts'].items():
            rows.append([subScore + 'AantalScore' + str(score), amount])

    for metascore, stats in statistics['metascoreStatistics'].items():
        rows.append([metascore + 'HoogsteScore', stats['highest']])
        rows.append([metascore + 'LaagsteScore', stats['lowest']])
        rows.append([metascore + 'GemiddeldeScore', round(stats['mean'], 2)])
        rows.append([metascore + 'MediaanScore', stats['median']])
        for score, amount in stats['scoreAmounts'].items():
            rows.append([metascore + 'AantalScore' + str(score), amount])

    with open(statisticsFilePath, 'w', newline='') as tsvfile:
        statisticsWriter = csv.writer(
            tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Write header
        statisticsWriter.writerow(['key', 'value'])

        # Write rows
        for row in rows:
            statisticsWriter.writerow(row)
