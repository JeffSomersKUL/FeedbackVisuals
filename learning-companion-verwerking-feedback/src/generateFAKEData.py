import sys
import os
import reader.ConfigReader as ConfigReader
import reader.QuestionnairesReader as QuestionnairesReader
import reader.AnswerReader as AnswerReader
import writer.FeedbackCodeWriter as FeedbackCodeWriter
import writer.ConfigWriter as ConfigWriter
import writer.QuestionnaireWriter as QuestionnaireWriter
import writer.AnswerWriter as AnswerWriter
import shutil
import random
import csv

argv = sys.argv[1:]
if len(argv) != 1:
    print('Exactly one argument is needed: the path to the folder containing the necessary files.')
    sys.exit(1)
folderPath = argv[0]
fakefolderPath = folderPath + '_fake'
if os.path.exists(fakefolderPath):
    shutil.rmtree(fakefolderPath)

os.mkdir(fakefolderPath)

# Read config
config = ConfigReader.readConfig(folderPath)

try:
    #Read questionnaires
    questionnaires = QuestionnairesReader.readQuestionnaires(
        folderPath, config)
    print("Using questionnaires from file")
except:
    # Fake questionnaire
    print("Faking questionnaires")
    questionnaires = [(1, {a:a for a in ConfigReader.getSubscoreQuestionIds(config, "totaal")})]

answerOptions = config[ConfigReader.CONFIG_KEY_ALL_ANSWER_OPTIONS]
nbQuestions = config[ConfigReader.CONFIG_KEY_AMOUNT_QUESTIONS]
try:
    correctAnswers_map = AnswerReader.readCorrectAnswers(folderPath, config)
    print("Using correct answers from file")
    correctAnswers = [(i+1, correctAnswers_map[i+1])
                      for i in range(nbQuestions)]
except:
    # Fake correct answers
    print("Faking correct answers")
    correctAnswers = [(i+1, answerOptions[i % len(answerOptions)] ) for i in range(nbQuestions) ]

# Fake answers
# Generate 10 different sets of right answered questions for each amount of right answers
# Don't allow duplicates and a max of 500 iterations
all_answers = []
for amountRight in range(nbQuestions+1):
    iterations = 0
    rightSets = set()
    while len(rightSets) < 10 and iterations < 500:
        right = frozenset(random.sample([s for s in range(1, nbQuestions+1)], amountRight))
        rightSets.add(right)
        iterations+=1

    i = 0
    for right in rightSets:
        answers = {}
        answers["Snapshot"] = 1
        answers["Participant"] = f"{amountRight:02d}{i:03d}"
        answers["Group"] = ""
        for q in range(1, nbQuestions+1):
            if q in right:
                answer = ord(correctAnswers[q-1][1]) - ord('A')
            else:
                possible_answers = set([ord(a) - ord('A') for a in answerOptions] + [len(answerOptions)]) - set([ord(correctAnswers[q-1][1]) - ord('A')])
                answer = random.sample(possible_answers, 1)[0]
            answers["Q" + str(q)] = answer + 1
        all_answers.append(answers)
        i+=1

ConfigWriter.writeConfigFile(fakefolderPath+'/config.tsv', config, False)
QuestionnaireWriter.writeQuestionnairesFile(
    fakefolderPath+'/vragenlijsten.tsv', config, questionnaires)
AnswerWriter.writeCorrectAnswers(fakefolderPath, config, correctAnswers)

print("Writing qsf file")
with open(fakefolderPath+"/generated.qsf", 'w', newline='') as csvfile:
        writer = csv.writer(
            csvfile, delimiter=',', quoting=csv.QUOTE_NONE)

        keys = ["Snapshot", "Participant", "Group"] + \
            ["Q" + str(q) for q in range(1, nbQuestions+1)]
        # Writes header
        writer.writerow(keys)
        for answers in all_answers:
            writer.writerow(
                [answers[key] for key in keys])

metascore_names = config[ConfigReader.CONFIG_KEY_METASCORES]
if len(metascore_names) > 0:
    print("Generating metascores")
    all_metascores = []
    for answer in all_answers:
        metascores = {}
        metascores["IjkID"] = answer["Participant"]
        for metascore in metascore_names:
            metascores[metascore] = str(random.triangular(0, config[ConfigReader.CONFIG_KEY_SUBSCORE_MAXSCORE(metascore)])).replace(".", ",")[:5]
        all_metascores.append(metascores)
    print("Writing metascores.csv file")
    with open(fakefolderPath+"/metascores.csv", 'w', newline='') as csvfile:
        writer = csv.writer(
            csvfile, delimiter=';', quoting=csv.QUOTE_NONE)

        keys = ["IjkID"] + metascore_names

        # Writes header
        writer.writerow(keys)
        for metascores in all_metascores:
            writer.writerow(
                [metascores[key] for key in keys])

print("Writing feedback code mapping")
generatedFolder = fakefolderPath+"/_generated_data"
os.mkdir(generatedFolder)
feedbackFolder = generatedFolder+"/_feedback_platform_data"
os.mkdir(feedbackFolder)
with open(feedbackFolder+"/feedback_code_mapping.tsv", 'w', newline='') as tsvfile:
        writer = csv.writer(
            tsvfile, delimiter='\t', quoting=csv.QUOTE_NONE)

        # Writes header
        writer.writerow(["ijkID", "feedbackCode"])
        for answers in all_answers:
            writer.writerow(
                [answers["Participant"], str(config[ConfigReader.CONFIG_KEY_TEST_SESSION]) + config[ConfigReader.CONFIG_KEY_TEST_CODE] + answers["Participant"]])
