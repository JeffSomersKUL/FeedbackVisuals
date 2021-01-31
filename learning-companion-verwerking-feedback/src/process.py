import sys
import os
import reader.ConfigReader as ConfigReader
import reader.QuestionnairesReader as QuestionnairesReader
import reader.AnswerReader as AnswerReader
import reader.OMRReader as OMRReader
import reader.QSFReader as QSFReader
import reader.ResultsFileReader as ResultsFileReader
import reader.MetascoreReader as MetascoreReader
import processor.AnswerProcessor as AnswerProcessor
import processor.ScoreProcessor as ScoreProcessor
import processor.QuestionProcessor as QuestionProcessor
import processor.StatisticsProcessor as StatisticsProcessor
import writer.ScoreWriter as ScoreWriter
import writer.AnswerWriter as AnswerWriter
import writer.QuestionWriter as QuestionWriter
import writer.ConfigWriter as ConfigWriter
import writer.QuestionnaireWriter as QuestionnaireWriter
import writer.StatisticsWriter as StatisticsWriter
import writer.MetascoreWriter as MetascoreWriter

argv = sys.argv[1:]
if len(argv) > 2:
    print('Maximally two arguments supported: 1. the path to the folder containing the necessary files 2. (optional) qsf or omr, defaults to omr')
    sys.exit(1)
folderPath = argv[0]
if not os.path.exists(folderPath):
    print('Invalid path (' + folderPath + ') to folder')
    sys.exit(1)
inputType = argv[1] if len(argv) == 2 else 'omr'

# Read data
config = ConfigReader.readConfig(folderPath)
print(config)
questionnaires = QuestionnairesReader.readQuestionnaires(folderPath, config)
#print(questionnaires)
correctAnswers = AnswerReader.readCorrectAnswers(folderPath, config)
#print(correctAnswers)
if inputType == 'omr':
    allAnswers = OMRReader.readOMRFiles(folderPath, config, questionnaires)
elif inputType == 'qsf':
    allAnswers = QSFReader.readQSFFiles(folderPath, config, questionnaires)
elif inputType == 'qsf_usolveit':
    results_file_items = ResultsFileReader.readResultsFile(folderPath, config)
    allAnswersOnlineID = QSFReader.readQSFFiles(folderPath, config, questionnaires, False)
    allAnswers = []
    for onlineID, q, answers in allAnswersOnlineID:
        onlineIds = list(
            filter(lambda item: item["onlineId"] == onlineID, results_file_items))
        if len(onlineIds) == 0:
            print(f"Missing nummer {onlineID} in resultaatbestand")
            sys.exit(1)
        allAnswers.append((onlineIds[0]['nummer'], q, answers))
elif inputType == 'qsf_veralg_kul':
    allAnswers = QSFReader.readQSFFiles(folderPath, config, questionnaires, False)


# Process data
allMappedAnswers = AnswerProcessor.mapAllAnswers(allAnswers, questionnaires)
#print(allMappedAnswers)

allScores = ScoreProcessor.calculateAllScores(config, allMappedAnswers, correctAnswers)
#print(allScores)

questionAnswers = QuestionProcessor.calculateQuestionStatistics(config, allMappedAnswers, correctAnswers)
#print(questionAnswers)

allMetascores = MetascoreReader.readMetascores(folderPath, config)

statistics = StatisticsProcessor.calculateStatistics(config, allScores, allMetascores, questionnaires)
#print(statistics)


# Write data
ConfigWriter.writeConfig(folderPath, config)

QuestionnaireWriter.writeQuestionnaires(folderPath, config, questionnaires)

AnswerWriter.writeAllMappedAnswers(folderPath, config, allMappedAnswers)

ScoreWriter.writeAllScores(folderPath, config, allScores)
# TODO: Hoe 'geslaagd' berekenen ? Zal meestal wel hetzelfde zijn, enkel bij ia anders ?

QuestionWriter.writeQuestionAnswers(folderPath, config, questionAnswers, correctAnswers)

StatisticsWriter.writeStatistics(folderPath, config, statistics)

MetascoreWriter.writeAllMetascores(folderPath, config, allMetascores)
