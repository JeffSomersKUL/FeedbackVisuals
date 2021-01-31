import os
import sys
import csv
import string

CONFIG_KEY_TEST_CODE='toetsCode'
CONFIG_KEY_TEST_SESSION='toetsSessie'
CONFIG_KEY_AMOUNT_QUESTIONS = 'aantalVragen'
CONFIG_KEY_AMOUNT_ALTERNATIVES = 'aantalAlternatieven'
CONFIG_KEY_SUBSCORES='subScores'
CONFIG_KEY_SUBSCORE_MAXSCORE = lambda subScore: subScore + '-maxScore'
CONFIG_KEY_SUBSCORE_QUESTIONS = lambda subScore: subScore + '-vragen'
CONFIG_KEY_METASCORES = 'metascores'

CONFIG_KEY_ALL_ANSWER_OPTIONS = 'ANTWOORD_OPTIES' # uppercase string value means that it is generated, not read
CONFIG_KEY_FORMULA_SCORING_REDUCTION = 'FORMULA_SCORING_REDUCTION'

def readConfig(folderPath):
    configFile = folderPath + '/config.tsv'
    print('Reading config file:', configFile)
    if not os.path.exists(configFile):
        print('Config file (' +configFile + ') is missing')
        sys.exit(1)
    config = {}
    with open(configFile, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        for row in reader:
            config[row['key']] = row['value']
    checkMissingKeysInConfig(config)
    processedConfig = processConfig(config)
    checkMissingSubScoreKeysInConfig(processedConfig)
    checkMissingMetascoreKeysInConfig(processedConfig)
    processedConfig = processSubScoreKeysInConfig(processedConfig)
    processedConfig = processMetascoreKeysInConfig(processedConfig)
    validateConfig(processedConfig)
    return processedConfig

def getSubscores(config):
    return config[CONFIG_KEY_SUBSCORES]

def getSubscoreMaxScore(config, subScore):
    return config[CONFIG_KEY_SUBSCORE_MAXSCORE(subScore)]

def getSubscoreQuestionIds(config, subScore):
    return config[CONFIG_KEY_SUBSCORE_QUESTIONS(subScore)]

def getAllQuestionIds(config):
    vraagIds = set()
    for subScore in getSubscores(config):
        for vraagId in getSubscoreQuestionIds(config, subScore):
            vraagIds.add(vraagId)
    return vraagIds

def getAllAnswerOptions(config):
    return config[CONFIG_KEY_ALL_ANSWER_OPTIONS]


# Local method
def checkMissingKeysInConfig(config):
    neededKeys = [CONFIG_KEY_TEST_CODE, CONFIG_KEY_TEST_SESSION, CONFIG_KEY_AMOUNT_QUESTIONS, CONFIG_KEY_AMOUNT_ALTERNATIVES, CONFIG_KEY_SUBSCORES]
    hasMissing = False
    for key in neededKeys:
        if not key in config:
            print('Key', key, 'is missing in config file')  
            hasMissing = True
    if hasMissing:
        sys.exit(1)

# Local method
def checkMissingSubScoreKeysInConfig(processedConfig):
    neededSubScoreKeys = [CONFIG_KEY_SUBSCORE_MAXSCORE, CONFIG_KEY_SUBSCORE_QUESTIONS]
    hasMissing = False
    for subScoreKey in neededSubScoreKeys:
        for subScore in processedConfig[CONFIG_KEY_SUBSCORES]:
            key = subScoreKey(subScore)
            if not key in processedConfig:
                print('Key ' + key + ' is missing in config file')  
                hasMissing = True 
    if hasMissing:
        sys.exit(1)

# Local method
def checkMissingMetascoreKeysInConfig(processedConfig):
    neededMetascoreKeys = [CONFIG_KEY_SUBSCORE_MAXSCORE]
    hasMissing = False
    for MetascoreKey in neededMetascoreKeys:
        for Metascore in processedConfig[CONFIG_KEY_METASCORES]:
            key = MetascoreKey(Metascore)
            if not key in processedConfig:
                print('Key ' + key + ' is missing in config file')
                hasMissing = True
    if hasMissing:
        sys.exit(1)

# Local method
def processConfig(config):
    processors = [
        (CONFIG_KEY_TEST_CODE, lambda x:  x),
        (CONFIG_KEY_TEST_SESSION, int),
        (CONFIG_KEY_AMOUNT_QUESTIONS, int),
        (CONFIG_KEY_AMOUNT_ALTERNATIVES, int),
        (CONFIG_KEY_SUBSCORES, lambda x: [y.strip() for y in x.split('|')]),
        (CONFIG_KEY_METASCORES, lambda x: [y.strip() for y in x.split('|')] if len(x.strip()) > 0 else []),
    ]
    hasFailed = False
    for processor in processors:
        key, func = processor
        try:
            config[key] = func(config.get(key, ''))
        except:
            print('Invalid value '+ config[key] +' for ' + key)
            hasFailed = True

    # Answer related stuff: choices and guess correction value
    config[CONFIG_KEY_ALL_ANSWER_OPTIONS] = list(string.ascii_uppercase)[
        0:config[CONFIG_KEY_AMOUNT_ALTERNATIVES]]
    config[CONFIG_KEY_FORMULA_SCORING_REDUCTION] = 1.0 / (config[CONFIG_KEY_AMOUNT_ALTERNATIVES] - 1)

    if hasFailed:
        sys.exit(1)
    return config

# Local method
def processSubScoreKeysInConfig(processedConfig):
    processors = [
        (CONFIG_KEY_SUBSCORE_MAXSCORE, int),
        (CONFIG_KEY_SUBSCORE_QUESTIONS, lambda x: [int(y) for y in x.split('|')])
    ]
    hasFailed = False
    for processor in processors:
        for subScore in processedConfig[CONFIG_KEY_SUBSCORES]:
            keyFunc, func = processor
            key = keyFunc(subScore)
            try:
                processedConfig[key] = func(processedConfig[key])
            except:
                print('Invalid value '+ processedConfig[key] +' for ' + key)
                hasFailed = True
    if hasFailed:
        sys.exit(1)
    return processedConfig

# Local method
def processMetascoreKeysInConfig(processedConfig):
    processors = [
        (CONFIG_KEY_SUBSCORE_MAXSCORE, int)
    ]
    hasFailed = False
    for processor in processors:
        for metascore in processedConfig[CONFIG_KEY_METASCORES]:
            keyFunc, func = processor
            key = keyFunc(metascore)
            try:
                processedConfig[key] = func(processedConfig[key])
            except:
                print('Invalid value ' + processedConfig[key] + ' for ' + key)
                hasFailed = True
    if hasFailed:
        sys.exit(1)
    return processedConfig

# Local method
def validateConfig(processedConfig):
    hasError = False
    if processedConfig[CONFIG_KEY_AMOUNT_QUESTIONS] < 1:
        print(CONFIG_KEY_AMOUNT_QUESTIONS + ' should at least be 1')
        hasError = True

    for subScore in processedConfig[CONFIG_KEY_SUBSCORES]:
        key = CONFIG_KEY_SUBSCORE_MAXSCORE(subScore)
        if processedConfig[key] < 1:
            print(key + ' should at least be 1')
            hasError = True

    for subScore in processedConfig[CONFIG_KEY_SUBSCORES]:
        key = CONFIG_KEY_SUBSCORE_QUESTIONS(subScore)
        for vraagId in processedConfig[key]:
            if not (1 <= vraagId <= processedConfig[CONFIG_KEY_AMOUNT_QUESTIONS]):
                print(key + ': vraagId ' + str(vraagId) + ' should be between 1 and ' + str(processedConfig[CONFIG_KEY_AMOUNT_QUESTIONS]))
                hasError = True

    if hasError:
        sys.exit(1)

def readGeneratedConfig(folderPath):
    configFile = folderPath + '/config.tsv'
    print('Reading generated config file:', configFile)
    if not os.path.exists(configFile):
        print('Config file (' + configFile + ') is missing, did you run the process script ?')
        sys.exit(1)
    config = {}
    with open(configFile, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        for row in reader:
            config[row['key']] = row['value']
    processedConfig = processConfig(config)
    processedConfig = processSubScoreKeysInConfig(processedConfig)
    processedConfig = processMetascoreKeysInConfig(processedConfig)
    return processedConfig
