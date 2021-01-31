import csv
import os
import reader.ConfigReader as ConfigReader
import random

def generateAndWriteFeedbackCode(folderPath, config, ijkIDs):
    print('Checking feedback code mapping')
    outputFolderPath = folderPath + '/_feedback_platform_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
 
    feedbackCodeMappingFilePath = outputFolderPath + '/feedback_code_mapping.tsv'
    if os.path.exists(feedbackCodeMappingFilePath):
        print('Reading existing feedback codes')
        with open(feedbackCodeMappingFilePath, newline='') as csvfile:
            mapping = {}
            reader = csv.DictReader(csvfile, delimiter='\t')
            for row in reader:
                mapping[row['ijkID']] = row['feedbackCode']
        return mapping
    session = config[ConfigReader.CONFIG_KEY_TEST_SESSION]
    code = config[ConfigReader.CONFIG_KEY_TEST_CODE]
    feedback_mapping_file = folderPath + f'/../../feedback_mappings/{session}/feedbackmapping-{session}-{code}.csv'
    if os.path.exists(feedback_mapping_file):
        print('Reading feedback codes from feedback_mappings folder')
        with open(feedback_mapping_file, newline='') as csvfile:
            mapping = {}
            reader = csv.DictReader(csvfile, delimiter=',')
            for row in reader:
                mapping[int(row['ijkID'][-5:])] = row['feedbackcode']
    else:
        print('ONLY FOR TESTING: Generating and writing feedback codes')
        mapping = {}
        feedbackCodes = set()
        for ijkID in ijkIDs:
            numberPart = random.randint(10000, 99999)
            while numberPart in feedbackCodes:
                numberPart = random.randint(10000, 99999)
            mapping[ijkID] = str(config[ConfigReader.CONFIG_KEY_TEST_SESSION]) + config[ConfigReader.CONFIG_KEY_TEST_CODE] + str(numberPart)
            feedbackCodes.add(numberPart)
        
    with open(feedbackCodeMappingFilePath, 'w', newline='') as tsvfile:
        mappingWriter = csv.writer(tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        mappingWriter.writerow(['ijkID', 'feedbackCode'])

        for ijkID, feedbackCode in mapping.items():
            mappingWriter.writerow([ijkID, feedbackCode])

    return mapping
