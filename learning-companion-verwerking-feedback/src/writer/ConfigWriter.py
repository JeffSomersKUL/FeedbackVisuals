import csv
import os
import reader.ConfigReader as ConfigReader

def writeConfigFile(configFilePath, config, feedback):
    directMappedKeys = [ConfigReader.CONFIG_KEY_TEST_CODE, ConfigReader.CONFIG_KEY_TEST_SESSION,
                        ConfigReader.CONFIG_KEY_AMOUNT_QUESTIONS, ConfigReader.CONFIG_KEY_AMOUNT_ALTERNATIVES]
    
    directMappedKeys.extend(map(lambda s: ConfigReader.CONFIG_KEY_SUBSCORE_MAXSCORE(
    s), config[ConfigReader.CONFIG_KEY_SUBSCORES]))
    directMappedKeys.extend(map(lambda s: ConfigReader.CONFIG_KEY_SUBSCORE_MAXSCORE(
    s), config[ConfigReader.CONFIG_KEY_METASCORES]))

    listMappedKeys = [ConfigReader.CONFIG_KEY_SUBSCORES]
    if not feedback:
        listMappedKeys.append(ConfigReader.CONFIG_KEY_METASCORES)
    listMappedKeys.extend(map(lambda s: ConfigReader.CONFIG_KEY_SUBSCORE_QUESTIONS(
        s), config[ConfigReader.CONFIG_KEY_SUBSCORES]))

    with open(configFilePath, 'w', newline='') as tsvfile:
        configWriter = csv.writer(
            tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        configWriter.writerow(['key', 'value'])

        for directMappedKey in directMappedKeys:
            configWriter.writerow([directMappedKey, config[directMappedKey]])

        for listMappedKey in listMappedKeys:
            if listMappedKey == ConfigReader.CONFIG_KEY_SUBSCORES and feedback:
                configWriter.writerow([listMappedKey, '|'.join(
                    map(lambda x: str(x), config[listMappedKey] + config[ConfigReader.CONFIG_KEY_METASCORES]))])
            else:
                configWriter.writerow([listMappedKey, '|'.join(
                    map(lambda x: str(x), config[listMappedKey]))])

def writeConfig(folderPath, config):
    print('Writing config')
    outputFolderPath = folderPath + '/_generated_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    configFilePath = outputFolderPath + '/config.tsv'

    writeConfigFile(configFilePath, config, False)


def writeFeedbackConfig(folderPath, config):
    print('Writing feedback config')
    outputFolderPath = folderPath + '/_feedback_platform_data'
    if not os.path.exists(outputFolderPath):
        os.mkdir(outputFolderPath)
    configFilePath = outputFolderPath + '/' + \
        str(config[ConfigReader.CONFIG_KEY_TEST_SESSION]) + '-' + \
        config[ConfigReader.CONFIG_KEY_TEST_CODE] + '-config.tsv'

    writeConfigFile(configFilePath, config, True)
