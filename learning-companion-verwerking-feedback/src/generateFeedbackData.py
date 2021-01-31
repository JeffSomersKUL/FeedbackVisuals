import sys
import os
import reader.ConfigReader as ConfigReader
import reader.GeneratedDataReader as GeneratedDataReader
import writer.FeedbackCodeWriter as FeedbackCodeWriter
import writer.ConfigWriter as ConfigWriter
import writer.QuestionnaireWriter as QuestionnaireWriter
import writer.AnswerWriter as AnswerWriter
import writer.QuestionWriter as QuestionWriter
import writer.ScoreWriter as ScoreWriter
import writer.StatisticsWriter as StatisticsWriter
import generateFeedbackDataHelper as generateFeedbackDataHelper

argv = sys.argv[1:]
if len(argv) != 1:
    print('Exactly one argument is needed: the path to the folder containing the necessary files.')
    sys.exit(1)
folderPath = argv[0]
if not os.path.exists(folderPath):
    print('Invalid path (' + folderPath + ') to folder')
    sys.exit(1)
folderPath += '/_generated_data'
if not os.path.exists(folderPath):
    print('Invalid path (' + folderPath + ') to folder, did you run python process.py', argv[0], '?')
    sys.exit(1)

# read necessary files
[config, questionnaires, allMappedAnswers, scores, questionAnswers, statistics, metascores] = GeneratedDataReader.readGeneratedData(folderPath)

# Create feedbackcodes (read them if they exist already)
feedbackCodeMapping = FeedbackCodeWriter.generateAndWriteFeedbackCode(
    folderPath, config, list(map(lambda s: s[0], allMappedAnswers)))

# Map data with ijkID to feedbackCode
allMappedAnswersWithFeedbackCode = list(map(lambda x: (feedbackCodeMapping[x[0]], x[1], x[2]), allMappedAnswers))
scoresWithFeedbackCode = list(
    map(lambda x: (feedbackCodeMapping[x[0]], x[1], x[2], x[3]), scores))
metascoresWithFeedbackCode = list(
    map(lambda x:(feedbackCodeMapping[str(x[0])], x[1]), metascores)
)

# Calculate groups
for score in scoresWithFeedbackCode:
    feedbackCode, subScores, questionnaireId, passed = score
    for subScore, subScoreValues in subScores.items():
        groupsCalculators = generateFeedbackDataHelper.getGroupCalculators(
            config[ConfigReader.CONFIG_KEY_TEST_CODE], config[ConfigReader.CONFIG_KEY_TEST_SESSION], subScore)

        matchingGroups = list(filter(lambda c: c[0](
            subScoreValues['score']), groupsCalculators))
        if len(matchingGroups) == 0:
            raise Exception('Missing group for score', subScore, subScoreValues)

        subScoreValues['groupLabel'] = matchingGroups[0][1]

# Calculate peer scores based on groups
groupColorMapping = {}
peerScores = {}
for subScore in ConfigReader.getSubscores(config):
    groupsCalculators = generateFeedbackDataHelper.getGroupCalculators(
        config[ConfigReader.CONFIG_KEY_TEST_CODE], config[ConfigReader.CONFIG_KEY_TEST_SESSION], subScore)
    groupColorMapping[subScore] = {}
    for groupsCalculator in groupsCalculators:
        groupColorMapping[subScore][groupsCalculator[1]] = groupsCalculator[2]

    peerScores[subScore] = {}
    for score in scoresWithFeedbackCode:
        value = score[1][subScore]['groupLabel']
        peerScores[subScore][value] = peerScores[subScore].get(value, 0) + 1

# Write config file
ConfigWriter.writeFeedbackConfig(folderPath, config)

# Write vragenlijsten file
QuestionnaireWriter.writeFeedbackQuestionnaires(
    folderPath, config, questionnaires)

# Write antwoorden file
AnswerWriter.writeFeedbackAllMappedAnswers(
    folderPath, config, allMappedAnswersWithFeedbackCode)

# Write vraagAntwoorden file
QuestionWriter.writeFeedbackQuestionAnswers(
    folderPath, config, questionAnswers)

# Write scores file
ScoreWriter.writeFeedbackAllScores(folderPath, config, scoresWithFeedbackCode, metascoresWithFeedbackCode)

# Write peer scores file
ScoreWriter.writeFeedbackPeerScores(folderPath, config, peerScores, groupColorMapping)

# Write statistics
StatisticsWriter.writeFeedbackStatistics(folderPath, config, statistics)
