import reader.ConfigReader as ConfigReader
import reader.QuestionnairesReader as QuestionnairesReader
import reader.AnswerReader as AnswerReader
import reader.ScoreReader as ScoreReader
import reader.QuestionReader as QuestionReader
import reader.StatisticsReader as StatisticsReader
import reader.MetascoreReader as MetascoreReader

def readGeneratedData(folderPath):
    config = ConfigReader.readGeneratedConfig(folderPath)
    questionnaires = QuestionnairesReader.readGeneratedQuestionnaires(
        folderPath, config)
    allMappedAnswers = AnswerReader.readGeneratedMappedAnswers(folderPath, config)
    scores = ScoreReader.readGeneratedScores(folderPath, config)
    questionAnswers = QuestionReader.readGeneratedQuestionAnswers(
        folderPath, config)
    statistics = StatisticsReader.readGeneratedStatistics(folderPath, config)
    metascores = MetascoreReader.readGeneratedMetascores(folderPath, config)

    return [config, questionnaires, allMappedAnswers, scores, questionAnswers, statistics, metascores]
