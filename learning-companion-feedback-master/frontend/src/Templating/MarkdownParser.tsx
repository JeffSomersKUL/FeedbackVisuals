import * as React from 'react'
import { ProcessedData, FeedbackCodeInfo, Score, AnswerData, ISubScore } from "Shared/data"
import { Typography, Link } from "@material-ui/core"
import ScorePie from 'Components/ScorePie';
import FeedbackCodeInput from 'Components/FeedbackCodeInput';
import { DashboardSubStep } from 'Components/DashboardStepped';
import PeerCurrentBar from 'Components/PeerCurrentBar';
import ExercisesTable from 'Components/ExercisesTable';
import CSEFlow from 'Components/CSEFlow';
import CSEStackedBar from 'Components/CSEStackedBar';
import PeerCurrentFlow from 'Components/PeerCurrentFlow';
import ScoreHistogram from 'Components/ScoreHistogram';
import ExercisesMap from 'Components/ExercisesMap';

export default class MarkdownParser {
    public static parse(content: string, data?: ProcessedData, classes?: any, showQuestion?: (a: AnswerData, s: ISubScore) => void, handleFeedbackCode?: any, feedbackCodeInfo?: FeedbackCodeInfo): any {
        try {
            let contentToParse = this.filterConditionals(content, data)
            const items = contentToParse.split('\n').map((l) => this.fillInVariables(l.trim(), data!))
            .reduce((acc, line) => {
                let new_in_bullet_list = acc.in_bullet_list
                let new_items = acc.items.map(i => i)
                if(acc.in_bullet_list){
                    if(line.startsWith('- '))
                        new_items[new_items.length - 1].push(line)
                    else {
                        new_in_bullet_list=false
                        new_items.push([line])
                    }
                } else {
                    if(line.startsWith('- ')){
                        new_in_bullet_list = true
                    }
                    new_items.push([line])
                }
                return {
                    in_bullet_list: new_in_bullet_list,
                    items: new_items
                } 
            }, { in_bullet_list: false, items: []} as { in_bullet_list: boolean, items: string[][]})
            .items
            return items
            .map((item) => {
                if(item.length === 1 && !item[0].startsWith('- ')) {
                    const line = item[0]
                    if (line.startsWith('#')) {
                        let amount = 0
                        while (line.charAt(amount) === '#')
                            amount = amount + 1
                        const variants: ('h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
                        return (<Typography component="h1" variant={variants[amount - 1]} color="inherit" className={(classes) ? classes.title : undefined}>
                            {this.parseLinks(line.substr(amount + 1), false)}
                        </Typography>)
                    }
                    const visualisation = this.parseVisualisation(line, data!, showQuestion!, handleFeedbackCode!, feedbackCodeInfo!)
                    if (visualisation) {
                        return visualisation
                    }
                    else {
                        return this.parseLinks(line, true)
                    }
                } else {
                    return (<ul>
                        {item.map(i => (<li>{this.parseLinks(i.substr(2), true)}</li>))}
                    </ul>)
                }
            })
            .filter((item, i) => item != null)
            .map((item, i) => (<div key={i} style={{ marginTop: (i > 0) ? 15 : 0, marginLeft: (i > 0) ? 15 : 0, marginRight: 15 }}>{item}</div>))
        } catch (e) {
            return <Typography color="error" style={{minHeight: 100}}>Error: {e.message}</Typography>
        }
    }

    public static parseLinks(content: string, shouldParseTexts: boolean) {
        if (content === "")
            return null
        // eslint-disable-next-line
        const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/
        const nextMethod = (shouldParseTexts) ? (c: string) => this.parseMultiples(c, shouldParseTexts) : (c: string) => c

        const match = linkRegex.exec(content)
        if (match) {
            return (
                <span>
                    {MarkdownParser.parseLinks(content.substr(0, match.index), shouldParseTexts)}
                    <Link style={{color: 'blue'}} href={match[2]} target="_blank">{nextMethod(match[1])}</Link>
                    {MarkdownParser.parseLinks(content.substr(match.index + match[0].length), shouldParseTexts)}
                </span>
            )
        }
        return nextMethod(content)
    }

    public static parseMultiples(content: string, shouldParseTexts: boolean) {
        if(content === "")
            return null
        // eslint-disable-next-line
        const linkRegex = /<<<([0-9]+) ([a-zA-Z]+)\/([a-zA-Z]+)>>>/
        const nextMethod = (shouldParseTexts) ? (c: string) => this.parseText(c, 1) : (c: string) => c

        const match = linkRegex.exec(content)
        if (match) {
            return (
                <span>
                    {MarkdownParser.parseMultiples(content.substr(0, match.index), shouldParseTexts)}
                    <Typography component='span'>{`${match[1]} ${match[1]==='1' ? match[2] : match[3]}`}</Typography>
                    {MarkdownParser.parseMultiples(content.substr(match.index + match[0].length), shouldParseTexts)}
                </span>
            )
        }
        return nextMethod(content)
    }

    public static parseText(content: string, d: number = 1): any {
        if (content === "")
            return null
        const stars = '**'
        const us = '_'

        const firstStarsIndex = content.indexOf(stars)
        const firstUnderscoreIndex = content.indexOf(us)
        if (firstStarsIndex === firstUnderscoreIndex) {
            // none found
            return content
        }
        else if (firstUnderscoreIndex === -1 || (firstStarsIndex !== -1 && firstStarsIndex < firstUnderscoreIndex)) {
            const secondStarsIndex = content.indexOf(stars, firstStarsIndex + 1)
            if (secondStarsIndex === -1) {
                throw Error(`Bold stars not closed in ${content}`)
            }
            return (<span>{content.substring(0, firstStarsIndex)}<span style={{ fontWeight: 'bold' }}>{this.parseText(content.substring(firstStarsIndex + 2, secondStarsIndex), d + 1)}</span>{this.parseText(content.substr(secondStarsIndex + 2), d + 1)}</span>)
        }
        else {
            const secondUnderscoreIndex = content.indexOf(us, firstUnderscoreIndex + 1)
            if (secondUnderscoreIndex === -1) {
                throw Error(`Italic underscore not closed in ${content}`)
            }
            return (<span>{content.substring(0, firstUnderscoreIndex)}<span style={{ fontStyle: 'italic' }}>{this.parseText(content.substring(firstUnderscoreIndex + 1, secondUnderscoreIndex), d + 1)}</span>{this.parseText(content.substr(secondUnderscoreIndex + 1), d + 1)}</span>)
        }
    }

    private static getConditionalRegex() {
        // eslint-disable-next-line
        return /(((?!BEGIN\d).)*)(BEGIN(\d)((\[als ([^\[\] ]*) (<=|>=|!=|=|<|>) ([^\[\] ]*)( en ([^\[\] ]*) (<=|>=|!=|=|<|>) ([^\[\] ]*))*\])+)(((?!EINDE\4).)*)EINDE\4)(.*)/gms
    }

    public static filterConditionals(content: string, data?: ProcessedData): string {
        let match
        let newContent = content
        // use getter in next line to get a 'new' regex object every time because we always match the whole content
        // eslint-disable-next-line
        while (match = this.getConditionalRegex().exec(newContent)) {
            const conditions = this.parseConditions(match[5])
            const sideToValue = (side: EquationSide) => (side.type === 'variable') ? this.variableToValue(side.value as string, data!) : side.value
            const valid = conditions.map(
                equations => equations.map(equation =>
                    equation.operator(sideToValue(equation.lhs), sideToValue(equation.rhs))
                ).reduce((b1, b2) => b1 && b2, true)
            ).reduce((b1, b2) => b1 || b2, false)
            if (valid)
                newContent = match[1] + match[14].substr(1) + match[16].substr(0)
            else
                newContent = match[1] + match[16].substr(0)
        }


        return newContent
    }

    public static checkConditionals(content: string): boolean {
        let match
        let newContent = content
        // use getter in next line to get a 'new' regex object every time because we always match the whole content
        // eslint-disable-next-line
        while (match = this.getConditionalRegex().exec(newContent)) {
            this.parseConditions(match[5])
            newContent = match[1] + match[14].substr(1) + match[16].substr(1)
        }

        return true
    }

    private static parseConditions(conditionsString: string) {
        // eslint-disable-next-line
        const conditionsRegex = /\[als ([^\]]*)\]/gms
        let match
        const conditions: string[] = []
        // eslint-disable-next-line
        while (match = conditionsRegex.exec(conditionsString)) {
            conditions.push(match[1].replace('\n', ''))
        }

        return conditions.map(c => this.parseCondition(c))
    }

    private static parseCondition(condition: string): Equation[] {
        const equations = condition.split(' en ').map(part => part.trim())
            .map(e => this.parseEquation(e))
        return equations
    }

    private static parseEquation(equation: string): Equation {
        const equationRegex = /(.*) (<=|>=|!=|=|<|>) (.*)/
        const match = equationRegex.exec(equation)        

        if (match) {
            return {
                lhs: MarkdownParser.parseEquationSide(match[1]),
                operator: MarkdownParser.parseOperator(match[2]),
                rhs: MarkdownParser.parseEquationSide(match[3]),
            }
        }
        throw Error(`Slecht geformateerde vergelijking: ${equation}`)
    }

    private static parseEquationSide(equationSide: string): EquationSide {
        if (equationSide.trim() === 'true'){
            return {
                type: 'boolean',
                value: true
            }
        } else if(equationSide.trim() === 'false') {
            return {
                type: 'boolean',
                value: false
            }
        }
        const stringRegex = /^(["'])(.*)\1$/ // allows strings wrapped in "" or '', no escaping needed
        let match
        // eslint-disable-next-line
        if (match = stringRegex.exec(equationSide)) {
            return {
                type: 'string',
                value: match[2]
            }
        }
        if (equationSide.startsWith('@')) {
            if(this.findVariables(equationSide).length === 1){
                return {
                    type: 'variable',
                    value: equationSide
                }
            }
            throw Error(`Onbekende variable ${equationSide}.`)
        }
        const value = Number(equationSide)
        if (isNaN(value))
            throw Error(`${equationSide} is geen geldig getal. Gebruik quotes ("") rond strings en @ voor variabelennamen.`)
        return {
            type: 'number',
            value
        }
    }

    private static parseOperator(operator: string) {
        switch (operator) {
            case '<':
                return <T extends {}>(lhs: T, rhs: T) => lhs < rhs
            case '>':
                return <T extends {}>(lhs: T, rhs: T) => lhs > rhs
            case '<=':
                return <T extends {}>(lhs: T, rhs: T) => lhs <= rhs
            case '>=':
                return <T extends {}>(lhs: T, rhs: T) => lhs >= rhs
            case '=':
                return <T extends {}>(lhs: T, rhs: T) => lhs === rhs
            case '!=':
                return <T extends {}>(lhs: T, rhs: T) => lhs !== rhs
            default:
                throw Error(`Unknown operator ${operator}`)

        }
    }

    private static findScore = (data: ProcessedData, params?: string[], selector?: (s: Score) => any) => {
        const mapper = (selector) ? selector : (a:any) => a
        if (data && params && params.length === 1) {
            const score = data.scores.filter(s => s.name === params[0])[0]
            if(score)
                return mapper(score)
            return undefined
        }
        return undefined
    }

    public static supportedVariables(): Variable[] {
        return [
            {
                name: '@score', nbArgs: 1, value: (data: ProcessedData, params: string[]) => this.findScore(data, params, (score: Score) => score.score.score),
                description: 'De score van de student voor de subscore "arg1".' 
            },
            {
                name: '@maxScore', nbArgs: 1, value: (data: ProcessedData, params: string[]) => this.findScore(data, params, (score: Score) => score.score.maxScore),
                description: 'De maxScore voor subscore "arg1".'
            },
            {
                name: '@aantalJuist', nbArgs: 1, value: (data: ProcessedData, params: string[]) => this.findScore(data, params, (score: Score) => score.score.numberCorrect),
                description: 'Het aantal juiste antwoorden van de student op vragen van het subdeel "arg1".'
            },
            {
                name: '@aantalFout', nbArgs: 1, value: (data: ProcessedData, params: string[]) => this.findScore(data, params, (score: Score) => score.score.numberWrong),
                description: 'Het aantal foute antwoorden van de student op vragen van het subdeel "arg1".'
            },
            {
                name: '@aantalBlanco', nbArgs: 1, value: (data: ProcessedData, params: string[]) => this.findScore(data, params, (score: Score) => score.score.numberBlanco),
                description: 'Het aantal blanco antwoorden van de student op vragen van het subdeel "arg1".'
            },
            {
                name: '@scoreGroep', nbArgs: 1, value: (data: ProcessedData, params: string[]) => this.findScore(data, params, (score: Score) => score.score.groupLabel),
                description: 'De groep waartoe de student behoort volgens zijn/haar resultaat op subscore "arg1".'
            },
            {
                name: '@geslaagd', nbArgs: 0, value: (data: ProcessedData, _params: string[]) => data.passed, description: 'Een booleanse waarde die zegt of de student geslaagd was.'
            },
            {
                name: '@aantalVragen', nbArgs: 1, value: (data: ProcessedData, params: string[]) => data.config.subscores.find(s => s.name === params[0]) && data.config.subscores.find(s => s.name === params[0])!.vragenIds ? data.config.subscores.find(s => s.name === params[0])!.vragenIds!.length : undefined, description: 'Het totale aantal vragen van de toets.'
            },
            {
                name: '@vragenreeks', nbArgs: 0, value: (data: ProcessedData, _params: string[]) => data.questionnaire, description: 'De vragenreeks die de deelnemer heeft gekregen.'
            },
            {
                name: '@gemiddelde', nbArgs: 1, value: (data: ProcessedData, params: string[]) => data.statistics.subScoreStatistics.find(s => s.subScoreName === params[0]) && data.statistics.subScoreStatistics.find(s => s.subScoreName === params[0])!.meanScore, description: 'De gemiddelde score op subscore "arg1".'
            },            
            {
                name: '@mediaan', nbArgs: 1, value: (data: ProcessedData, params: string[]) => data.statistics.subScoreStatistics.find(s => s.subScoreName === params[0]) && data.statistics.subScoreStatistics.find(s => s.subScoreName === params[0])!.medianScore, description: 'De mediaan van de scores op subscore "arg1".'
            },
            {
                name: '@hoogsteScore', nbArgs: 1, value: (data: ProcessedData, params: string[]) => data.statistics.subScoreStatistics.find(s => s.subScoreName === params[0]) && data.statistics.subScoreStatistics.find(s => s.subScoreName === params[0])!.highestScore, description: 'De hoogste score op subscore "arg1".'
            },
            {
                name: '@laagsteScore', nbArgs: 1, value: (data: ProcessedData, params: string[]) => data.statistics.subScoreStatistics.find(s => s.subScoreName === params[0]) && data.statistics.subScoreStatistics.find(s => s.subScoreName === params[0])!.lowestScore, description: 'De laagste score op subscore "arg1".'
            },
            {
                name: '@aantalScoreTussen', nbArgs: 3, value: (data: ProcessedData, params: string[]) => data.statistics.subScoreStatistics.find(s => s.subScoreName === params[0]) && data.statistics.subScoreStatistics.find(s => s.subScoreName === params[0])!.scoreAmounts.reduce((a, { score, amount }) => a + ((score >= parseInt(params[1]) && score <= parseInt(params[2])) ? amount : 0), 0), description: 'Het aantal deelnemers met een score op subscore "arg1" van minstens "arg2" en maximaal "arg3".'
            },
            {
                name: '@percentageScoreTussen', nbArgs: 4, value: (data: ProcessedData, params: string[]) => data.statistics.subScoreStatistics.find(s => s.subScoreName === params[0]) && (100 * data.statistics.subScoreStatistics.find(s => s.subScoreName === params[0])!.scoreAmounts.reduce((a, { score, amount }) => a + ((score >= parseInt(params[1]) && score <= parseInt(params[2])) ? amount : 0), 0) / data.statistics.amountOfParticipants).toFixed(parseInt(params[3])), description: 'Het procentueel aantal deelnemers met een score op subscore "arg1" van minstens "arg2" en maximaal "arg3" afgerond om "arg4" cijfers na de komma.'
            },
            {
                name: '@aantalDeelnemers', nbArgs: 0, value: (data: ProcessedData, _params: string[]) => data.statistics.amountOfParticipants, description: 'Het aantal deelnemers aan de toets.'
            }
        ]
    }

    public static findVariables(variableName: string) : {m: RegExpMatchArray, variable: Variable}[] {
        return this.supportedVariables().map(item => ({ variable: item, m: variableName.match(new RegExp(`${item.name}(\\(.*?\\))?$`)) }))
            .filter(e => e.m && e.variable).map(e => ({...e, m: e.m!}))
    }

    public static variableToValue(variableName: string, data: ProcessedData): string | number {
        const found = this.findVariables(variableName)
        if (found.length === 0)
            return variableName
        if ((found[0].variable.nbArgs || 0) === 0)
            return found[0].variable.value!(data)
        if (!found[0].m![1])
            return variableName

        const args = found[0].m![1].substring(1, found[0].m![1].length - 1).split(",")
        return found[0].variable.value!(data, args)
    }

    public static containsVariables(line: string) {
        return this.supportedVariables().filter((v) => line.indexOf(v.name) > -1).length > 0
    }

    public static fillInVariables(line: string, data: ProcessedData) {
        return this.supportedVariables().filter(s => s.value)
            .reduce((currentLine, r) => currentLine.replace(new RegExp(`${r.name}(\\(.*?\\))?`, 'g'), (m) => {
                const val = this.variableToValue(m, data)
                if(val!==undefined)
                    return val.toString()
                return m
            }), line)
    }

    public static supportedVisualisations(data?: ProcessedData, showQuestion?: (a: AnswerData, s: ISubScore) => void, handleFeedbackCode?: any, feedbackCodeInfo?: FeedbackCodeInfo): { name: string, nbArgs?: number, react: (s: string[]) => any, needsData: boolean, description: string, returnsData?: boolean }[] {
        return [
            { name: '@ScoreDonut', nbArgs: 1, react: (args: string[]) => {
                if(data){
                    const foundScore = data.scores.filter(s => s.name === args[0])[0]
                    if(foundScore)
                        return (<ScorePie ijkingstoetsScore={foundScore.score} height={200} />)
                }
                return undefined 
            },
                needsData: true, description: 'Donut diagram dat de score op de ijkingstoets en het aantal juiste, foute en niet ingevulde vragen toont voor de subscore "arg1".'
            },
            { name: '@PuntenFlow', nbArgs: 1, react: (args: string[]) => { 
                if(data){
                    const foundScore = data.scores.filter(s => s.name === args[0])[0]
                    if (foundScore && foundScore.peerScore)
                        return (<PeerCurrentFlow peerScore={foundScore.peerScore} />)
                }
                return undefined
            }, needsData: true, description: 'Flow diagram dat een overzicht geeft van de scores (voor de subscore "arg1") op de ijkingstoets van de deelnemers.' },
            {
                name: '@PuntenBar', nbArgs: 1, react: (args: string[]) => {
                    if (data) {
                        const foundScore = data.scores.filter(s => s.name === args[0])[0]
                        if (foundScore && foundScore.peerScore)
                            return (<PeerCurrentBar peerScore={foundScore.peerScore} highlightedScoreGroup={foundScore.score.groupLabel} />)
                    }
                    return undefined
                }, needsData: true, description: 'Staafdiagram dat een overzicht geeft van de scores (voor de subscore "arg1") op de ijkingstoets van de deelnemers.' },
            {
                name: '@CSEFlow', nbArgs: 1, react: (args: string[]) => {
                    if (data) {
                        const foundScore = data.scores.filter(s => s.name === args[0])[0]
                        if (foundScore && foundScore.cseScore)
                            return (<CSEFlow cseScore={foundScore.cseScore} />)
                    }
                    return undefined
                }, needsData: true, description: 'Flow diagram dat toont wat de CSE van deelnemers van vorige jaren is afhankelijk van hun score (voor de subscore "arg1") op de ijkingstoets.'
            },
            {
                name: '@CSEStacked', nbArgs: 1, react: (args: string[]) => {
                    if (data) {
                        const foundScore = data.scores.filter(s => s.name === args[0])[0]
                        if (foundScore && foundScore.cseScore)
                            return (<CSEStackedBar cseScore={foundScore.cseScore} highlightedScoreGroup={foundScore.score.groupLabel} />)
                    }
                    return undefined
                }, needsData: true, description: 'Stacked bar diagram dat toont wat de CSE van deelnemers van vorige jaren is afhankelijk van hun score (voor de subscore "arg1") op de ijkingstoets.'
            },            
            {
                name: '@OefeningenMap', nbArgs: 1, react: (args: string[]) => { 
                    const subscore = (data) ? data.config.subscores.filter(a => a.name === args[0])[0] : undefined
                    if (subscore) {                         
                        return (<ExercisesMap
                    subscore={subscore}
                    answers={data!.answers}
                    onQuestionClick={(a: AnswerData) => showQuestion!(a, subscore)} />) 
                    }
                    else
                      return undefined
                }, needsData: true,
                description: 'Visualisatie van de resultaten op alle vragen van subscore "arg1". De oefeningen worden opgesplits in juist, fout en niet-beantwoord. Ook wordt getoond hoeveel deelnemers de vraag juist hadden.'
            },
            {
                name: '@OefeningenTabel', nbArgs: 1, react: (args: string[]) => {
                    const subscore = (data) ? data.config.subscores.filter(a => a.name === args[0])[0] : undefined
                    if (subscore) {
                        return (<ExercisesTable
                            subscore={subscore}
                            answers={data!.answers}
                            onQuestionClick={(a: AnswerData) => showQuestion!(a, subscore)} />)
                    }
                    else
                        return undefined
                }, needsData: true,
                description: 'Visualisatie van de resultaten op alle vragen van subscore "arg1" in tabelvorm.'
            },
            /*{
                name: '@OefeningenMap2Mixed', react: (data) ? (<ExercisesMap2
                    answers={data.answers}
                    mixTypes={true}
                    onQuestionClick={(questionIndex: number) => {
                        setSelectedQuestionIndex(questionIndex)
                    }} />) : undefined, needsData: true,
                description: 'Visualisatie van de resultaten op alle vragen. Voor elke oefening wordt getoond of ze juist, fout of niet beantwoord is en hoeveel deelnemers de vraag juist hadden.'
            },*/   
            {
                name: '@FeedbackCode', react: (args: string[]) => (<FeedbackCodeInput onDataRetrieval={handleFeedbackCode} feedbackCodeInfo={feedbackCodeInfo!} />), needsData: false, returnsData: true,
                description: 'Inputveld waarin de feedbackcode kan worden ingevuld.'
            },
            {
                name: '@PuntenHistogram', nbArgs: 1, react: (args: string[]) => {
                    const subscoreStats = (data) ? data.statistics.subScoreStatistics.filter(a => a.subScoreName === args[0])[0] : undefined
                    const subScore = (data) ? data.scores.filter(s => s.name === args[0])[0] : undefined
                    if (subscoreStats) {
                        return (<ScoreHistogram
                            scores={subscoreStats}
                            userScore={subScore!.score.score}
                        />)
                    }
                    else
                        return undefined
                }, needsData: true,
                description: 'Visualisatie van de resultaten van alle deelnemers op subscore "arg1".'
            }
        ]
    }

    public static parseVisualisation(line: string, data: ProcessedData, showQuestion: (a: AnswerData, s: ISubScore) => void, handleFeedbackCode: any, feedbackCodeInfo: FeedbackCodeInfo) {
        const found = this.supportedVisualisations(data, showQuestion, handleFeedbackCode, feedbackCodeInfo)
            .map(item => { return { ...item, m: line.match(new RegExp(`${item.name}(\\(.*?\\))?$`)) } }).filter(item => item.m)
        if (found.length === 0)
            return undefined
        if ((found[0].nbArgs || 0) === 0)
            return found[0].react([])
        if (!found[0].m![1])
            return undefined
        const args = found[0].m![1].substring(1, found[0].m![1].length - 1).split(",")
        return found[0].react(args)
    }

    public static needsData(subStep: DashboardSubStep): boolean {
        return subStep.mdString.split('\n')
            .map((l: string) => l.trim())
            .map((l: string) => this.containsVariables(l) || this.supportedVisualisations().filter(i => l.match(new RegExp(`${i.name}(\\(.*?\\))?$`)) && i.needsData).length > 0).reduce((a: boolean, b: boolean) => a || b, false)
    }

    public static providesData(subStep: DashboardSubStep): boolean {
        return subStep.mdString.split('\n')
            .map((l: string) => l.trim())
            .map((l: string) => this.supportedVisualisations().filter(i => i.name === l && i.returnsData).length > 0).reduce((a: boolean, b: boolean) => a || b, false)
    }


}

interface Equation {
    lhs: EquationSide,
    operator: <T extends {}>(lhs: T, rhs: T) => boolean,
    rhs: EquationSide
}

interface EquationSide {
    type: string,
    value: number | string | boolean
}

interface Variable { name: string, nbArgs?: number, value: any, description: string }