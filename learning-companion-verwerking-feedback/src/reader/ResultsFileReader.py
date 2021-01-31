import os
import sys
import csv
import reader.ConfigReader as ConfigReader

def readResultsFile(folderPath, config):
    resultsFile = folderPath + f'/resultaatbestand-{config[ConfigReader.CONFIG_KEY_TEST_SESSION]}-{config[ConfigReader.CONFIG_KEY_TEST_CODE]}.csv'
    print('Reading resultaatbestand file:', resultsFile)
    if not os.path.exists(resultsFile):
        print('Results file (' + resultsFile + ') is missing')
        sys.exit(1)
    results_file_items = []
    with open(resultsFile, newline='') as csvfile:
        content = csvfile.readlines()

        reader = csv.DictReader(content[1:], delimiter=',') # don't read first line
        hasError = False
        for row in reader:
            try:
                if int(row['ijkingstoetssessie']) != int(config[ConfigReader.CONFIG_KEY_TEST_SESSION]):
                    print('Resultaatbestand contains participants of different session: ' + row['ijkingstoetssessie'])
                    hasError = True
                    continue
                item = {
                    "nummer": int(row['nummer']),
                }
                if "onlineID" in row:
                    item["onlineId"] = row['onlineID']
                if "ijkID" in row:
                    item["ijkId"] = row['ijkID']
                results_file_items.append(item)
            except Exception as e:
                hasError = True
                print(e)
    if hasError:
        sys.exit(1)
    return results_file_items
