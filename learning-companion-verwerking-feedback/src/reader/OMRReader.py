import os
import sys
import xlrd
import reader.ConfigReader as ConfigReader

def readOMRFiles(folderPath, config, questionnaires):
    omrFiles = [ f for f in 
                    [os.path.join(folderPath, f) for f in os.listdir(folderPath) if "_OMRoutput" in f]
                 if os.path.isfile(f)]
    if len(omrFiles) > 0:
        print('Found', len(omrFiles),'OMR files:', ','.join(omrFiles))
    else:
        print('Error no OMR files found.')
        sys.exit(1)

    results = []
    usedIjkIds = set()
    for f in omrFiles:
        print('Processing', f)
        book = xlrd.open_workbook(f)
        sheet = book.sheet_by_index(0)

        num_rows = sheet.nrows
        columns = sheet.row_values(0)
        validateORMColumns(columns, config, questionnaires) 

        
        for row in range(1, num_rows):
            rowValues = sheet.row_values(row)
            rowData = {}
            for c in range(len(columns)):
                rowData[columns[c]] = rowValues[c]
            if rowData['ijkID'] in usedIjkIds:
                print('Duplicate ijkid', rowData['ijkID'], 'found!')
                sys.exit(1)
            usedIjkIds.add(rowData['ijkID'])
            results.append(rowData)
    return list(map(lambda r: processOMRData(r, config, questionnaires), results))

# Local method
def validateORMColumns(columns, config, questionnaires):
    neededColumns = ['ijkID', 'vragenreeks', * ['Vraag' +
                                               str(id) for id in ConfigReader.getAllQuestionIds(config)]]
    hasMissing = False
    for column in neededColumns:
        if not column in columns and (column != 'vragenreeks' or len(questionnaires) > 1):
                print('OMR file misses the "'+ column + '" column')
                hasMissing = True

    if hasMissing:
        sys.exit(1)

def toAnswerLetter(number, config):
    if number == 0 or number == config[ConfigReader.CONFIG_KEY_AMOUNT_ALTERNATIVES] + 1:
        return 'X'
    return chr(ord('A') + number - 1)

# Local method
def processOMRData(item, config, questionnaires):
    result = [0,0,{}] # ijkid, questionnaire, answers (by position)
    try:
        result[0] = int(item['ijkID'])
    except:
        print(item['ijkID'], 'is an invalid ijkID, integer expected')
        sys.exit(1)

    try:
        result[1] = int(
            item['vragenreeks']) if 'vragenreeks' in item else 1
    except:
        print(item['vragenreeks'], 'is an invalid vragenreeks, int expected')
        sys.exit(1)
    questionnaire = list(
        filter(lambda x: x[0] == result[1], questionnaires))
    if len(questionnaire) == 0:
        print('Questionnaire', result[1],
              'of student with ijkid', result[0], 'does not exist')
        sys.exit(1)
    
    for key, value in item.items():
        if key[:5] == "Vraag":
            number = int(key[5:])
            result[2][number] = toAnswerLetter(int(value), config)

    return tuple(result)
    
