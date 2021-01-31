import sys
import os
import reader.GeneratedDataReader as GeneratedDataReader
import reader.ConfigReader as ConfigReader
import math
import subprocess

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
    print('Invalid path (' + folderPath +
          ') to folder, did you run python process.py', argv[0], '?')
    sys.exit(1)

# read necessary files
[config, questionnaires, allMappedAnswers, scores, questionAnswers,
    statistics] = GeneratedDataReader.readGeneratedData(folderPath)

def createExerciseVisualisation(questionAnswers, categoryMapper, outputFilePath, categoryColorMapper = lambda c: ('#b3b3b3', '#e6e6e6')):
    print(f'Creating exercise visualisation: {outputFilePath}')
    answers = list(map(lambda q: {**q[1], 'questionId': q[0], 'percentageCorrect': round(100 *
                                                                q[1]['amountRight'] / q[1]['amountOfAnswers'])}, questionAnswers))

    laneFilter = lambda answer, category: (lambda lane : lane['category'] == category and lane['answers'][-1]['percentageCorrect'] * 7.5 + 15 <= answer['percentageCorrect'] * 7.5 - 15)
    # Creating lanes so circles don't overlap
    lanes = []
    answers.sort(key= lambda a: a['percentageCorrect'])
    for answer in answers:
        category = categoryMapper(answer)
        possibleLanes = list(filter(laneFilter(answer, category), lanes))
        if len(possibleLanes) == 0:
            lane = { 'category': category, 'answers': []}
            lanes.append(lane)
        else:
            lane = possibleLanes[0]
        lane['answers'].append(answer)

    currentPosition = -50
    currentCategory = 'default'
    lanedAnswers = []
    for index, lane in enumerate(sorted(lanes, key= lambda l: l['category'])):    
        if (index == 0 or currentCategory != lane['category']):
            currentPosition += 35
            currentCategory = lane['category']
        else:
            currentPosition += 30
        for answer in lane['answers']:
            lanedAnswers.append([currentPosition, answer])

    currentPosition += 30
    with open(outputFilePath, 'w', newline='') as outputFile:
        print("""<svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width='1200px'
                    viewBox="0 0 850 """, currentPosition + 100, "\">", sep="", file=outputFile)

        transform = '"translate(10, 0)"'

        # Draw dased lines
        for i in range(11):
            print("<line transform=",transform," key=\"", i, "\" x1=\"", i * 75, "\" x2=\"", i * 75, "\" y1=\"0\" y2=\"", currentPosition +
                10, "\" stroke=\"#5184AF\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-dasharray=\"1, 30\"/>", sep="", file=outputFile)

        for pos, a in lanedAnswers:
            colors = categoryColorMapper(categoryMapper(a))
            print("""<g
                        transform=""",transform,"""
                        style="cursor: 'pointer'"
                    >
                                    <title>""", a['percentageCorrect'], """% van de deelnemers had vraag """,a['questionId'], """ juist.</title>
                                    <circle cx=\"""",a['percentageCorrect'] * 7.5,"""\" cy=\"""",pos,"""\" r="15" stroke=\"""",colors[0],"""\" stroke-width="3" fill=\"""",colors[1],"""\">
                                    
                        </circle>
                        
                        <text
                                        x=\"""", a['percentageCorrect'] * 7.5, """\" y=\"""",pos,"""\" dy=".3em" text-anchor="middle"
                        >
                            """,a['questionId'],"""
                        </text>
                        
                                </g>""", sep="", file=outputFile)

        print(f'<line transform={transform} x1="0" x2="780" y1="{currentPosition}" y2="{currentPosition}" stroke="#5184AF" stroke-width="2" />', file=outputFile)
        print(f'<line transform={transform} x1="770" x2="780" y1="{currentPosition - 10}" y2="{currentPosition}" stroke="#5184AF" stroke-width="2" />', file=outputFile)
        print(
            f'<line transform={transform} x1="770" x2="780" y1="{currentPosition + 10}" y2="{currentPosition}" stroke="#5184AF" stroke-width="2" />', file=outputFile)

        for i in range(11):
            print(
                f'<text transform={transform} key="{i}" x="{i * 75}" y="{currentPosition + 20}" text-anchor="middle">{i*10}%</text>', file=outputFile)

        print(
            f'<text transform={transform} x="500" y="{currentPosition - 5}" font-size="12">Percentage studenten dat de vraag juist had</text>', file=outputFile)

        print("</svg>", file=outputFile)
    convertSvgToPng(outputFilePath)

def convertSvgToPng(svgFilePath):
    print(f'Converting {svgFilePath} to pdf')
    pdfFilePath = svgFilePath.replace('.svg', '.pdf')
    try:
        res = subprocess.check_output(
            f'"C:\Program Files\Inkscape\inkscape.exe" -D -z --file={svgFilePath} --export-pdf {pdfFilePath}', shell=True)
        
    except OSError as e:
        print("Execution failed:", e)
    except subprocess.CalledProcessError as ex:  # error code <> 0
        print("--------error------")
        print(ex.cmd)
        print(ex.returncode)
        print(ex.output)  # c
      

subScoreNames = ConfigReader.getSubscores(config)
for subScoreName in subScoreNames:
    questionIds = ConfigReader.getSubscoreQuestionIds(config, subScoreName)
    createExerciseVisualisation(list(filter(lambda q: q[0] in questionIds, questionAnswers)), lambda a: 'default', folderPath + '/exercisesVisualisation' + subScoreName + '.svg')

classFiles = [os.path.join(argv[0], f) for f in os.listdir(
    argv[0]) if "_CLASSreeks1.tex" in f]
if(len(classFiles) == 1):
    with open(argv[0] + '/' + classFiles[0], 'r') as file:
        data = file.read()
        lines = data.split('\n')
    createExerciseVisualisation(
        questionAnswers, lambda a: lines[a['questionId']-1].strip(), folderPath + '/exercisesVisualisationByStars.svg', lambda c: ('#b3b3b3', '#e6e6e6') if c == '**' else (('#66FF66', '#CCFFCC') if c == "*" else ('#FF6666', '#FFCCCC')))
