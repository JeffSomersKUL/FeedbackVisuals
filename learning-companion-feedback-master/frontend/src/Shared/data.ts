export interface FeedbackCodeInfo {
    feedbackCode?: string;
    session: Number;
    program: string;
}

export const getfeedbackCodeRegex = () => /^(\d+)([a-z][a-z]).*$/;
export const parseFeedbackCode = (feedbackCode: string) => {
    const feedbackCodeMatch = feedbackCode.match(getfeedbackCodeRegex());
    if (feedbackCodeMatch) {
        return {
            feedbackCode,
            session: Number(feedbackCodeMatch[1]),
            program: feedbackCodeMatch[2]
        } as FeedbackCodeInfo;
    }
    return undefined;
};

export interface Score {
    name: string;
    score: IjkingstoetsScore;
    peerScore?: PeerScore;
    cseScore?: CSEScore;
}

export type ToetsCode = "wb";

export interface ISubScore {
    name: string;
    maxScore: number;
    vragenIds?: number[];
}

export interface IConfig {
    toetsCode: ToetsCode;
    toetsSessie: number;
    aantalVragen: number;
    subscores: ISubScore[];
}

export type IStatisticsItemType = "lowest" | "highest" | "mean" | "median" | "scoreAmounts" | "amountOfStudents";

export interface IStatisticsItem {
    subScoreName?: string;
    type: IStatisticsItemType;
    value: number;
    arg?: number;
}

export interface ScoreAmount {
    score: number;
    amount: number;
}

export interface SubScoreStatistics {
    subScoreName: string;
    highestScore: number;
    lowestScore: number;
    meanScore: number;
    medianScore: number;
    scoreAmounts: ScoreAmount[];
}

export interface Statistics {
    amountOfParticipants: number;
    subScoreStatistics: SubScoreStatistics[];
}

export interface ProcessedData {
    passed: boolean;
    answers: AnswerData[];
    scores: Score[];
    feedbackCode: string;
    config: IConfig;
    statistics: Statistics;
    questionnaire: number;
}

export interface ParticipationResponse extends ProcessedData {
    canEdit: boolean;
}

export interface AllAnswersData {
    A: number;
    B: number;
    C: number;
    D: number;
    X: number;
}

export interface AnswerData {
    questionId: number;
    position: number;
    givenAnswer: string;
    correctAnswer?: string;
    allAnswers?: AllAnswersData;
    percentageCorrect?: number;
    percentageBlanco?: number;
}

export interface IjkingstoetsInfo {
    group: string; // reeks in dutch
    date: string;
    name: string;
    studyProgram: string;
}

export interface IjkingstoetsScore {
    score: number;
    maxScore: number;
    hasBreakdown: boolean;
    numberCorrect?: number;
    numberBlanco?: number;
    numberWrong?: number;
    groupLabel?: string;
}

export interface PeerScorePart {
    label: string;
    amount: number;
    color: string;
}

export interface CSEScorePart {
    scoreGroupLabel: string;
    scoreGroupColor: string;
    cseGroupLabel: string;
    cseGroupColor: string;
    percentage: number;
}

export interface PeerScore {
    parts: PeerScorePart[];
}

export interface CSEScore {
    parts: CSEScorePart[];
}

export interface LMHCSEPrediction {
    lowToTopPct: number;
    lowToMiddlePct: number;
    lowToBottomPct: number;
    middleToTopPct: number;
    middleToMiddlePct: number;
    middleToBottomPct: number;
    highToTopPct: number;
    highToMiddlePct: number;
    highToBottomPct: number;
}

export interface NegPosCSEPrediction {
    unknownToTopPct: number;
    unknownToMiddlePct: number;
    unknownToBottomPct: number;
    negativeToTopPct: number;
    negativeToMiddlePct: number;
    negativeToBottomPct: number;
    neutralToTopPct: number;
    neutralToMiddlePct: number;
    neutralToBottomPct: number;
    positiveToTopPct: number;
    positiveToMiddlePct: number;
    positiveToBottomPct: number;
}

export interface WeakGoodCSEPrediction {
    veryWeakToTopPct: number;
    veryWeakToMiddlePct: number;
    veryWeakToBottomPct: number;
    weakToTopPct: number;
    weakToMiddlePct: number;
    weakToBottomPct: number;
    meanToTopPct: number;
    meanToMiddlePct: number;
    meanToBottomPct: number;
    goodToTopPct: number;
    goodToMiddlePct: number;
    goodToBottomPct: number;
    veryGoodToTopPct: number;
    veryGoodToMiddlePct: number;
    veryGoodToBottomPct: number;
}

export interface Program {
    name: string;
    code: string;
    sessions: Array<{
        session: number;
        files: {
            feedbackFiles: string[]
            feedbackFilesLastChanged: string
            personalFeedbackFiles: string[]
            personalFeedbackFilesLastChanged: string
        }
    }>;
}

export const mandatoryFeedbackFileTypes = ["antwoorden", "config", "peerScores", "scores", "statistieken", "vraagAntwoorden", "vragenlijsten"];
export const feedbackFileTypes = [...mandatoryFeedbackFileTypes, "cseScores"
];
