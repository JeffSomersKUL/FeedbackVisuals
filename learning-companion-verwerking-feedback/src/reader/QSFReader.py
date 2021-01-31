import os
import sys
import csv
import reader.ConfigReader as ConfigReader
import reader.OMRReader as OMRReader


def readQSFFiles(folderPath, config, questionnaires, parseIjkIdInt=True):
    qsfFiles = [ f for f in 
                    [os.path.join(folderPath, f) for f in os.listdir(folderPath) if ".qsf" in f]
                 if os.path.isfile(f)]
    if len(qsfFiles) > 0:
        print('Found', len(qsfFiles), 'qsf files:', ','.join(qsfFiles))
    else:
        print('Error no QSF files found.')
        sys.exit(1)

    results = []
    usedIjkIds = set()
    for f in qsfFiles:
        print('Processing', f)

        with open(f, newline='') as csvfile:
            reader = csv.DictReader(csvfile, delimiter=',')

            items = []
            for row in reader:
                items.append(row)

            columns = items[0].keys()
            validateQSFColumns(columns, config, questionnaires)

            for rowData in items:
                if rowData['Participant'] in usedIjkIds:
                    print('Duplicate ijkid', rowData['Participant'], 'found!')
                    sys.exit(1)
                usedIjkIds.add(rowData['Participant'])
                if rowData['Participant'] != '999999' and rowData['Participant'] != 'Antwoordsleutel': # Don't add the solutions as a user
                    results.append(rowData)
        
    return list(map(lambda row: processQSFRow(row, config, questionnaires, parseIjkIdInt), results))

# Local method
def validateQSFColumns(columns, config, questionnaires):
    neededColumns = ['Participant', *['Q' +
                                      str(id) for id in ConfigReader.getAllQuestionIds(config)]]
    hasMissing = False
    for column in neededColumns:
        if not column in columns:
                print('QSF file misses the "'+ column + '" column')
                hasMissing = True

    if hasMissing:
        sys.exit(1)

# Local method
def processQSFRow(item, config, questionnaires, parseIjkIdInt):
    result = [0,0,{}] # ijkid/onlineID, questionnaire, answers (by position)
    try:
        if parseIjkIdInt: #TODO removd this param
            result[0] = item['Participant']
        else:
            result[0] = item['Participant']
    except Exception as e:
        print(item['Participant'], 'is an invalid ijkID, integer expected')
        print(e)
        sys.exit(1)

    try:
        if 'Snapshot' in item:
            result[1] = int(item['Snapshot'])
        else:
            print("Using default snapshot 1")
            result[1] = 1
    except:
        print(item['Snapshot'], 'is an invalid vragenreeks, int expected')
        sys.exit(1)
    questionnaire = list(
        filter(lambda x: x[0] == result[1], questionnaires))
    if len(questionnaire) == 0:
        print('Questionnaire', result[1],
              'of student with ijkid', result[0], 'does not exist')
        sys.exit(1)
    
    for key, value in item.items():
        if key[:1] == "Q" and key[1:].isdigit():
            number = int(key[1:])
            result[2][number] = OMRReader.toAnswerLetter(int(value), config)

    return tuple(result)
    
