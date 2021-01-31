def isPassingScore(testCode, testSession, scores):
    if testCode in ["wb", "bw", "la"]:
        if testSession < 15:
            return scores['totaal']['score'] >= 10
        elif testSession == 19:
            return scores['zonder_basis']['score'] >= 10
    elif testCode == "ww":
        return scores['totaal']['score'] >= 10
    elif testCode in ["in", "ib", "id"]:
        return scores['totaal']['score'] >= 10
    elif testCode == "fa":
        return scores['totaal']['score'] >= 10
    elif testCode == "dw":
        return scores['totaal']['score'] >= 10
    elif testCode == "bi":
        return scores['totaal']['score'] >= 10
    elif testCode == "ir":
        return scores['totaal']['score'] >= 10
    elif testCode in ["ew", "hi", "hw"]:
        return scores['totaal']['score'] >= 10
    elif testCode == "ia":
        return scores['totaal']['score'] >= 10 and scores['wiskunde']['score'] >= 10
    elif testCode in ["xa", "xb", "xc", "xd", "xe", "xf"]:
        return scores['totaal']['score'] >= 10
    raise Exception(
        'isPassingScore in processHelper not implemented for test ' + str(testSession) + '' + testCode)
