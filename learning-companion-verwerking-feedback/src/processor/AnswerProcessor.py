def mapAllAnswers(answers, questionnaires):
    print('Mapping all answers')
    return list(map(lambda a: mapAnswers(a, questionnaires), answers))

def mapAnswers(answer, questionnaires):
    # ijkID, vraagId to answer mapping, questionnaire
    mappedAnswer = (answer[0], {}, answer[1])
    questionnaire = [q for q in questionnaires if q[0] == answer[1]][0]
    for vraagId, qPos in questionnaire[1].items():
        mappedAnswer[1][vraagId] = answer[2][qPos]
    return mappedAnswer
