import re
import os
import sys
import reader.ConfigReader as ConfigReader
import reader.TexReader as TexReader
import writer.QuestionWriter as QuestionWriter
import writer.QuestionnaireWriter as QuestionnaireWriter

argv = sys.argv[1:]
if len(argv) != 1:
    print('Exactly one argument is needed: the path to the folder containing the necessary files.')
    sys.exit(1)
folderPath = argv[0]
if not os.path.exists(folderPath):
    print('Invalid path (' + folderPath + ') to folder')
    sys.exit(1)

# Read data
config = ConfigReader.readConfig(folderPath)
print(config)
if config[ConfigReader.CONFIG_KEY_TEST_CODE] not in ["ir", "ew", "hw", "hi"]:
    print('This script can only be used for ir, ew, hw and hi.')
    sys.exit(1)

nbQuestions = len(ConfigReader.getAllQuestionIds(config))

solutions = TexReader.readSolutions(folderPath, config)

if config[ConfigReader.CONFIG_KEY_TEST_CODE] == "ir":
    questionnaires = TexReader.readQuestionnaires(folderPath, config)
else:
    questionnaires = [(1, {a: a for a in ConfigReader.getSubscoreQuestionIds(config, "totaal")})]

# Write data

QuestionWriter.writeInputQuestionAnswers(folderPath, solutions)

QuestionnaireWriter.writeInputQuestionnaires(folderPath, config, questionnaires)



