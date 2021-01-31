import sys
import os
import reader.ConfigReader as ConfigReader
import reader.GeneratedDataReader as GeneratedDataReader
import reader.ResultsFileReader as ResultsFileReader
import writer.ResultsWriter as ResultsWriter

argv = sys.argv[1:]
if len(argv) != 1:
    print('Exactly one argument is needed: the path to the folder containing the necessary files.')
    sys.exit(1)
folderPath = argv[0]
if not os.path.exists(folderPath):
    print('Invalid path (' + folderPath + ') to folder')
    sys.exit(1)
folderPath_generated = folderPath + '/_generated_data'
if not os.path.exists(folderPath_generated):
    print('Invalid path (' + folderPath + ') to folder, did you run python process.py', argv[0], '?')
    sys.exit(1)

# read necessary files
[config, questionnaires, allMappedAnswers, scores, questionAnswers,
    statistics, metascores] = GeneratedDataReader.readGeneratedData(folderPath_generated)

results_file_items = ResultsFileReader.readResultsFile(folderPath, config)

# write resultaatbestand
ResultsWriter.writeResultsFile(folderPath, config, scores, results_file_items)
