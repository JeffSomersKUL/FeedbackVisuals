import csv
import os
import reader.ConfigReader as ConfigReader
import generateFeedbackDataHelper as generateFeedbackDataHelper

def writeAllMetascores(folderPath, config, allMetascores):
    if len(config[ConfigReader.CONFIG_KEY_METASCORES]) == 0:
        return
        
    print('Writing all metascores')
    outputFolderPath = folderPath + '/_generated_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    allMetascoresFilePath = outputFolderPath + '/metascores.tsv'

    columnMappers = [('ijkID', lambda key, val: int(key[-5:]))]
    for subScore in config[ConfigReader.CONFIG_KEY_METASCORES]:
        columnMappers.append((subScore + 'Score', (lambda subScore: lambda key,
                                                   val: val[subScore])(subScore)))

    with open(allMetascoresFilePath, 'w', newline='') as tsvfile:
        scoresWriter = csv.writer(tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        scoresWriter.writerow([cm[0] for cm in columnMappers])

        for key, value in allMetascores:
            scoresWriter.writerow([cm[1](key, value) for cm in columnMappers])
