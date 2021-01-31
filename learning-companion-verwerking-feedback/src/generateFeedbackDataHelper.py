COLOR_LOW = "rgb(255,140,0)"
COLOR_MIDDLE = "rgb(255,215,0)"
COLOR_HIGH = "rgb(144,238,144)"
COLOR_HIGHER = "rgb(21, 132, 21)"

def getGroupCalculators(testCode, testSession, subScore):
    res = None
    if testSession < 15:
        res = getGroupCalculatorsBefore15(testCode, testSession, subScore)
    elif testSession == 17:
        res = getGroupCalculators17(testCode, testSession, subScore)
    elif testSession == 18:
        res = getGroupCalculators18(testCode, testSession, subScore)
    elif testSession == 19:
        res = getGroupCalculators19(testCode, testSession, subScore)
        if res is None:
            res = getGroupCalculators19X(testCode, testSession, subScore)
    elif testSession == 20:
        res = getGroupCalculators20(testCode, testSession, subScore)
        if res is None:
            res = getGroupCalculators20X(testCode, testSession, subScore)

    if res == None:
        raise Exception('getGroupCalculators in generateFeedbackDataHelper not implemented for subscore ' +
                        subScore + ' in test ' + str(testSession) + '' + testCode)
    return res


def getGroupCalculators17(testCode, testSession, subScore):
    if testCode == "dw":
        if subScore in ["totaal", 'totaal_geen_correctie']:
            return [
                (lambda score: score < 5, '<5', COLOR_LOW),
                (lambda score: 5 <= score <= 9, '5-9', COLOR_MIDDLE),
                (lambda score: score >= 10, '>=10', COLOR_HIGH)
            ]
        elif subScore in ["wiskunde","wiskunde_geen_correctie", "chemie", "chemie_geen_correctie", "fysica", "fysica_geen_correctie"]:
            return [
                (lambda score: score < 3, '<3', COLOR_LOW),
                (lambda score: 3 <= score <= 4, '3-4', COLOR_MIDDLE),
                (lambda score: score >= 5, '>=5', COLOR_HIGH)
            ]
    elif testCode == "ir":
        return [
            (lambda score: score <= 7, '<=7', COLOR_LOW),
            (lambda score: 8 <= score <= 9, '8-9', COLOR_MIDDLE),
            (lambda score: 10 <= score <= 13, '10-13', COLOR_HIGH),
            (lambda score: score >= 14, '>=14', COLOR_HIGHER)
        ]
    elif testCode == "ia":
        if subScore in ["totaal"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde"]:
            return [
                (lambda score: score <= 6, '<=6', COLOR_LOW),
                (lambda score: 7 <= score <= 9, '7-9', COLOR_MIDDLE),
                (lambda score: score >= 10, '>=10', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_basis"]:
            return [
                (lambda score: score <= 4, '<=4', COLOR_LOW),
                (lambda score: 5 <= score <= 7, '5-7', COLOR_MIDDLE),
                (lambda score: score >= 8, '>=8', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_standaard"]:
            return [
                (lambda score: score < 4, '<4', COLOR_LOW),
                (lambda score: 4 <= score <= 6, '4-6', COLOR_MIDDLE),
                (lambda score: score >= 7, '>=7', COLOR_HIGH)
            ]
        elif subScore in ["ruimtelijk"]:
            return [
                (lambda score: score <= 4, '<=4', COLOR_LOW),
                (lambda score: 5 <= score <= 7, '5-7', COLOR_MIDDLE),
                (lambda score: score >= 8, '>=8', COLOR_HIGH)

            ]


def getGroupCalculators18(testCode, testSession, subScore):
    if testCode == "dw":
        if subScore in ["totaal"]:
            return [
                (lambda score: score < 5, '<5', COLOR_LOW),
                (lambda score: 5 <= score <= 9, '5-9', COLOR_MIDDLE),
                (lambda score: score >= 10, '>=10', COLOR_HIGH)
            ]
        elif subScore in ["wiskunde", "chemie", "fysica"]:
            return [
                (lambda score: score < 3, '<3', COLOR_LOW),
                (lambda score: 3 <= score <= 4, '3-4', COLOR_MIDDLE),
                (lambda score: score >= 5, '>=5', COLOR_HIGH)
            ]
    elif testCode == "ir":
        return [
            (lambda score: score <= 7, '<=7', COLOR_LOW),
            (lambda score: 8 <= score <= 9, '8-9', COLOR_MIDDLE),
            (lambda score: 10 <= score <= 13, '10-13', COLOR_HIGH),
            (lambda score: score >= 14, '>=14', COLOR_HIGHER)
        ]
    elif testCode == "ia":
        if subScore in ["totaal"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde"]:
            return [
                (lambda score: score <= 6, '<=6', COLOR_LOW),
                (lambda score: 7 <= score <= 9, '7-9', COLOR_MIDDLE),
                (lambda score: score >= 10, '>=10', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_basis"]:
            return [
                (lambda score: score <= 4, '<=4', COLOR_LOW),
                (lambda score: 5 <= score <= 7, '5-7', COLOR_MIDDLE),
                (lambda score: score >= 8, '>=8', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_standaard"]:
            return [
                (lambda score: score < 4, '<4', COLOR_LOW),
                (lambda score: 4 <= score <= 6, '4-6', COLOR_MIDDLE),
                (lambda score: score >= 7, '>=7', COLOR_HIGH)
            ]
        elif subScore in ["ruimtelijk"]:
            return [
                (lambda score: score <= 4, '<=4', COLOR_LOW),
                (lambda score: 5 <= score <= 7, '5-7', COLOR_MIDDLE),
                (lambda score: score >= 8, '>=8', COLOR_HIGH)

            ]

def getGroupCalculators19(testCode, testSession, subScore):
    if testCode in ["wb", "bw"]: 
        if subScore in ["totaal", "zonder_basis"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)

            ] 
        elif subScore in ["wiskunde_basis"]:
            return [
                (lambda score: score < 7, '<7', COLOR_LOW),
                (lambda score: 7 <= score <= 8, '7-8', COLOR_MIDDLE),
                (lambda score: score >= 9, '>=9', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_standaard"]:
            return [
                (lambda score: score < 8, '<8', COLOR_LOW),
                (lambda score: 8 <= score <= 11, '8-11', COLOR_MIDDLE),
                (lambda score: score >= 12, '>=12', COLOR_HIGH)

            ]
        elif subScore in ["chemie"]:
            return [
                (lambda score: score < 5, '<5', COLOR_LOW),
                (lambda score: 5 <= score <= 6, '5-7', COLOR_MIDDLE),
                (lambda score: score >= 7, '>=7', COLOR_HIGH)

            ]
    elif testCode in ["la"]: 
        if subScore in ["totaal", "zonder_basis"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)

            ] 
        elif subScore in ["wiskunde_basis"]:
            return [
                (lambda score: score < 7, '<7', COLOR_LOW),
                (lambda score: 7 <= score <= 8, '7-8', COLOR_MIDDLE),
                (lambda score: score >= 9, '>=9', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_standaard"]:
            return [
                (lambda score: score < 8, '<8', COLOR_LOW),
                (lambda score: 8 <= score <= 11, '8-11', COLOR_MIDDLE),
                (lambda score: score >= 12, '>=12', COLOR_HIGH)

            ]
        elif subScore in ["taalvaardigheid"]:
            return [
                (lambda score: score < 5, '<5', COLOR_LOW),
                (lambda score: 5 <= score <= 6, '5-7', COLOR_MIDDLE),
                (lambda score: score >= 7, '>=7', COLOR_HIGH)

            ]
    elif testCode == "fa": 
        if subScore in ["totaal", "zonder_basis"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_basis"]:
            return [
                (lambda score: score < 7, '<7', COLOR_LOW),
                (lambda score: 7 <= score <= 8, '7-8', COLOR_MIDDLE),
                (lambda score: score >= 9, '>=9', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_standaard"]:
            return [
                (lambda score: score < 8, '<8', COLOR_LOW),
                (lambda score: 8 <= score <= 11, '8-11', COLOR_MIDDLE),
                (lambda score: score >= 12, '>=12', COLOR_HIGH)

            ]
        elif subScore in ["chemie"]:
            return [
                (lambda score: score < 5, '<5', COLOR_LOW),
                (lambda score: 5 <= score <= 6, '5-7', COLOR_MIDDLE),
                (lambda score: score >= 7, '>=7', COLOR_HIGH)

            ]
    elif testCode in ["ew", "hw", "hi"]:
        if subScore in ["wiskunde"]:
            return [
                (lambda score: score < 9, '<9', COLOR_LOW),
                (lambda score: 9 <= score < 15, '9-14', COLOR_MIDDLE),
                (lambda score: 15 <= score < 22, '15-21', COLOR_HIGH),
                (lambda score: score >= 22, '>=22', COLOR_HIGHER)
            ]
        elif subScore in ["totaal"]:
            return [
                (lambda score: score < 6, '<6', COLOR_LOW),
                (lambda score: 6 <= score < 10, '6-9', COLOR_MIDDLE),
                (lambda score: 10 <= score < 15, '10-14', COLOR_HIGH),
                (lambda score: score >= 15, '>14', COLOR_HIGHER)
            ]
        else:
            return [(lambda score: True, subScore, COLOR_MIDDLE)]
    elif testCode in ["in","ib", "id"]:
        if subScore in ["totaal"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_basis"]:
            return [
                (lambda score: score < 7, '<7', COLOR_LOW),
                (lambda score: 7 <= score <= 8, '7-8', COLOR_MIDDLE),
                (lambda score: score >= 9, '>=9', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_standaard"]:
            return [
                (lambda score: score < 8, '<8', COLOR_LOW),
                (lambda score: 8 <= score <= 11, '8-11', COLOR_MIDDLE),
                (lambda score: score >= 12, '>=12', COLOR_HIGH)
            ]
    elif testCode == "dw":
        if subScore in ["totaal"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)
            ]
        elif subScore in ["wiskunde", "chemie", "fysica"]:
            return [
                (lambda score: score < 7, '<7', COLOR_LOW),
                (lambda score: 7 <= score <= 8, '7-8', COLOR_MIDDLE),
                (lambda score: score >= 9, '>=9', COLOR_HIGH)
            ] 

def getGroupCalculators19X(testCode, testSession, subScore):
    if testCode in ["xa", "xd"]: 
        if subScore in ["totaal", "zonder_basis"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)

            ] 
        elif subScore in ["wiskunde_basis"]:
            return [
                (lambda score: score < 7, '<7', COLOR_LOW),
                (lambda score: 7 <= score <= 8, '7-8', COLOR_MIDDLE),
                (lambda score: score >= 9, '>=9', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_standaard"]:
            return [
                (lambda score: score < 8, '<8', COLOR_LOW),
                (lambda score: 8 <= score <= 11, '8-11', COLOR_MIDDLE),
                (lambda score: score >= 12, '>=12', COLOR_HIGH)

            ]
        elif subScore in ["chemie"]:
            return [
                (lambda score: score < 5, '<5', COLOR_LOW),
                (lambda score: 5 <= score <= 6, '5-7', COLOR_MIDDLE),
                (lambda score: score >= 7, '>=7', COLOR_HIGH)

            ]
    elif testCode in ["xe"]: 
        if subScore in ["totaal", "zonder_basis"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)

            ] 
        elif subScore in ["wiskunde_basis"]:
            return [
                (lambda score: score < 7, '<7', COLOR_LOW),
                (lambda score: 7 <= score <= 8, '7-8', COLOR_MIDDLE),
                (lambda score: score >= 9, '>=9', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_standaard"]:
            return [
                (lambda score: score < 8, '<8', COLOR_LOW),
                (lambda score: 8 <= score <= 11, '8-11', COLOR_MIDDLE),
                (lambda score: score >= 12, '>=12', COLOR_HIGH)

            ]
        elif subScore in ["taalvaardigheid"]:
            return [
                (lambda score: score < 5, '<5', COLOR_LOW),
                (lambda score: 5 <= score <= 6, '5-7', COLOR_MIDDLE),
                (lambda score: score >= 7, '>=7', COLOR_HIGH)

            ]
    elif testCode == "xc": 
        if subScore in ["totaal", "zonder_basis"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_basis"]:
            return [
                (lambda score: score < 7, '<7', COLOR_LOW),
                (lambda score: 7 <= score <= 8, '7-8', COLOR_MIDDLE),
                (lambda score: score >= 9, '>=9', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_standaard"]:
            return [
                (lambda score: score < 8, '<8', COLOR_LOW),
                (lambda score: 8 <= score <= 11, '8-11', COLOR_MIDDLE),
                (lambda score: score >= 12, '>=12', COLOR_HIGH)

            ]
        elif subScore in ["chemie"]:
            return [
                (lambda score: score < 5, '<5', COLOR_LOW),
                (lambda score: 5 <= score <= 6, '5-7', COLOR_MIDDLE),
                (lambda score: score >= 7, '>=7', COLOR_HIGH)

            ]
    elif testCode in ["xb"]:
        if subScore in ["totaal"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_basis"]:
            return [
                (lambda score: score < 7, '<7', COLOR_LOW),
                (lambda score: 7 <= score <= 8, '7-8', COLOR_MIDDLE),
                (lambda score: score >= 9, '>=9', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde_standaard"]:
            return [
                (lambda score: score < 8, '<8', COLOR_LOW),
                (lambda score: 8 <= score <= 11, '8-11', COLOR_MIDDLE),
                (lambda score: score >= 12, '>=12', COLOR_HIGH)
            ]

def getGroupCalculators20(testCode, testSession, subScore):
    if testCode == "ww":
        return [
            (lambda score: score < 8, '<8', COLOR_LOW),
            (lambda score: 8 <= score <= 12, '8-12', COLOR_MIDDLE),
            (lambda score: score >= 13, '>=13', COLOR_HIGH)
        ]
    elif testCode == "bi":
        if subScore in ["totaal"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde"]:
            return [
                (lambda score: score < 6, '<6', COLOR_LOW),
                (lambda score: 6 <= score <= 11, '6-11', COLOR_MIDDLE),
                (lambda score: score >= 12, '>=12', COLOR_HIGH)
            ]
        elif subScore in ["chemie_fysica"]:
            return [
                (lambda score: score < 3, '<3', COLOR_LOW),
                (lambda score: 3 <= score <= 4, '3-4', COLOR_MIDDLE),
                (lambda score: score >= 5, '>=5', COLOR_HIGH)
            ]

def getGroupCalculators20X(testCode, testSession, subScore):
    if testCode == "xf":
        return [
            (lambda score: score < 8, '<8', COLOR_LOW),
            (lambda score: 8 <= score <= 12, '8-12', COLOR_MIDDLE),
            (lambda score: score >= 13, '>=13', COLOR_HIGH)
        ]

def getGroupCalculatorsBefore15(testCode, testSession, subScore):
    if testCode == "wb":
        if subScore in ["totaal", "wiskunde"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)
                
            ]
        elif subScore in ["chemie", "basisvaardigheden"]:
            return [
                (lambda score: score < 5, '<5', COLOR_LOW),
                (lambda score: 5 <= score <= 6, '5-7', COLOR_MIDDLE),
                (lambda score: score >= 7, '>=7', COLOR_HIGH)
                
            ]
    elif testCode == "ir":
        return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH),                
            ]
    elif testCode in ["ew", "hw", "hi"]:
        if subScore in ["totaal"]:
            return [
                (lambda score: score < 10, '<10', COLOR_LOW),
                (lambda score: 10 <= score <= 13, '10-13', COLOR_MIDDLE),
                (lambda score: score >= 14, '>=14', COLOR_HIGH)

            ]
        elif subScore in ["wiskunde"]:
            return [
                (lambda score: score < 15, '<15', COLOR_LOW),
                (lambda score: 15 <= score <= 20, '15-20', COLOR_MIDDLE),
                (lambda score: score >= 20, '>=20', COLOR_HIGH)

            ]
        elif subScore in ["academisch-redeneren"]:
            return [
                (lambda score: score < 5, '<5', COLOR_LOW),
                (lambda score: 5 <= score <= 6, '5-7', COLOR_MIDDLE),
                (lambda score: score >= 7, '>=7', COLOR_HIGH)

            ]
