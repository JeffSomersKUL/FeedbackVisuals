import sys
import os
import reader.GeneratedDataReader as GeneratedDataReader
import reader.ConfigReader as ConfigReader
import matplotlib.pyplot as plt

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

amountOfParticipants = statistics['amountOfParticipants']
print('Aantal deelnemers:', amountOfParticipants)
# Scores
i = 0
for subScoreName, stats in statistics['subScoreStatistics'].items():
    print()
    print('Score:', subScoreName)
    print('Hoogste score:', stats['highest'])
    print('Laagste score:', stats['lowest'])
    print('Gemiddelde score:', stats['mean'])
    print('Mediaan score:', stats['median'])

    plt.subplot(len(statistics['subScoreStatistics']), 1, i+1)
    if i == 0:
        plt.title('Scores')

    histData = []
    for score, amount in stats['scoreAmounts'].items():
        histData.extend([score] * amount)
    
    plt.hist(histData, bins=list(map(lambda x: x-0.5,
                                range(config[ConfigReader.CONFIG_KEY_SUBSCORE_MAXSCORE(subScoreName)]+2))))
    plt.ylabel(subScoreName)
    plt.xticks(
        range(config[ConfigReader.CONFIG_KEY_SUBSCORE_MAXSCORE(subScoreName)]+1))

    i+=1

plt.xlabel('Score')
plt.show()

# Scores by series
if len(questionnaires) > 1:
    for q in questionnaires:
        for subScoreName, stats in statistics['questionnaireSubScoreStatistics'][q[0]].items():    
            print()
            print('Score:', subScoreName, 'voor reeks',
                  q[0], '(', sum(stats['scoreAmounts'].values()), ') deelnemers')
            print('Hoogste score:', stats['highest'])
            print('Laagste score:', stats['lowest'])
            print('Gemiddelde score:', stats['mean'])
            print('Mediaan score:', stats['median'])

print('Vragen')
for questionId, data in questionAnswers:
    print('Vraag', questionId, ':',
          data['correctAnswer'], round(100 * data['amountRight'] / data['amountOfAnswers']), '% juist')
