import * as React from 'react'
import { AnswerData, ISubScore } from '../Shared/data';
import { Typography } from '@material-ui/core';

export enum ResponseType {
    RIGHT,
    WRONG,
    UNANSWERED
}

export const answerToResponseType = (answer: AnswerData): ResponseType => {
    if (answer.givenAnswer === 'X')
        return ResponseType.UNANSWERED
    if (answer.correctAnswer === answer.givenAnswer)
        return ResponseType.RIGHT
    return ResponseType.WRONG
}

export const answerToResponseTypeData = (answer: AnswerData): [number, string, string] => {
    const r = answerToResponseType(answer)
    if (r === ResponseType.UNANSWERED)
        return [100, '#6464644D', '#64646470']
    if (r === ResponseType.RIGHT)
        return [0, '#00FF004D', '#00FF0070']
    return [50, '#FF00004D', '#FF000070']
}

interface Props {
    subscore: ISubScore
    answers: AnswerData[]
    mixTypes?: boolean
    onQuestionClick: (a: AnswerData) => void
}

type lane = { type: ResponseType, answers: AnswerData[] }

export default function ExercisesMap(props: Props) {
    const { onQuestionClick, mixTypes, subscore } = props
    if (!subscore.vragenIds)
        return (<Typography>Er zijn geen vragen gekoppeld aan deze subscore</Typography>)
        
    const answers = props.answers.map(a => { return {...a, percentageCorrect: (a.percentageCorrect) ?  Math.round(a.percentageCorrect) : undefined } })
    
    let laneFilter = (answer: AnswerData, r: ResponseType) => (l: lane) => l.type === r && ((l.answers[l.answers.length - 1].percentageCorrect && answer.percentageCorrect) ? (l.answers[l.answers.length - 1]!.percentageCorrect! * 7.5 + 15 <= answer.percentageCorrect * 7.5 - 15) : (!!l.answers[l.answers.length - 1]!.percentageCorrect === !!answer.percentageCorrect))
    if(mixTypes)
        laneFilter = (answer: AnswerData) => (l: lane) => ((l.answers[l.answers.length - 1].percentageCorrect && answer.percentageCorrect) ? (l.answers[l.answers.length - 1]!.percentageCorrect! * 7.5 + 15 <= answer.percentageCorrect * 7.5 - 15) : (!!l.answers[l.answers.length - 1]!.percentageCorrect === !!answer.percentageCorrect))

    // Creating lanes so circles don't overlap
    let lanes: lane[] = []
    answers.sort((a,b) => {
        if (a.percentageCorrect && b.percentageCorrect){
            return a.percentageCorrect - b.percentageCorrect
        } else if(a.percentageCorrect){
            return 1
        } else if(b.percentageCorrect){
            return -1
        }
        return 0
    })
    answers.forEach(answer => {
        if(subscore.vragenIds!.indexOf(answer.questionId) === -1) // Only show elements that are part of the subscore
            return
        const r = answerToResponseType(answer)
        const possibleLanes = lanes.filter(laneFilter(answer, r))
        let lane : lane;
        if(possibleLanes.length === 0){
            lane = { type: r, answers : []}
            lanes.push(lane)
        }
        else {
            //possibleLanes.sort((a,b) => a.answers.length - b.answers.length)
            lane = possibleLanes[0]
        }
        lane.answers.push(answer)
    })
    //if(mixTypes){
        //lanes = [...lanes.slice(Math.floor(2 * lanes.length / 3), lanes.length), ...lanes.slice(0, Math.floor(2 * lanes.length / 3))]
    //}        
    //else
    if(!mixTypes){
        lanes.sort((a, b) => a.type - b.type)
    }
    //console.log(lanes)
    //const lanedAnswers: [number, AnswerData][] = lanes.map((lane, index) => lane.answers.map(answer => [index, answer])).reduce((acc, val) => acc.concat(val), [])
    let currentPosition = -50
    let currentType: ResponseType = ResponseType.RIGHT
    const lanedAnswers: [number, AnswerData][] = lanes.map((lane, index) => {
        if (index === 0 || currentType !== lane.type) {
            currentPosition += 35
            currentType = lane.type
            return [lane, currentPosition] as [lane, number]
        }
        currentPosition += 30
        return [lane, currentPosition] as [lane, number]
    }).flatMap(([lane, pos]) => lane.answers.map(answer =>  {
        return [pos, answer]
    }))
    currentPosition += 30

    return (
        <div
            style={{
                height: 'auto',
                width:'100%'
            }}
        >
            
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width='100%'
            style={{maxHeight: 250}}
            viewBox={`0 0 850 ${currentPosition + 100}`}
        >   
                {[...Array(11)].map((e, i) =>
                    <line transform="translate(50, 50)" key={i} x1={`${i * 75}`} x2={`${i * 75}`} y1="0" y2={currentPosition + 10} stroke="#5184AF" strokeWidth="2" strokeLinecap="round" strokeDasharray="1, 30" />
                )
                }
            
                {lanedAnswers.map(([pos, a]) => 
                (
                        <g
                            transform="translate(50, 50)"
                                     onClick={e => {
                                onQuestionClick(a)
                            }}
                            style={{ cursor: 'pointer' }}
                            key={a.questionId}
                        >
                            {a.percentageCorrect && (<title>{`${a.percentageCorrect.toFixed(0)}% van de deelnemers had vraag ${a.position} juist.\nKlik op de cirkel voor een gedetailleerd overzicht van de vraag.`}</title>)}
                            <circle cx={`${(a.percentageCorrect || 50) * 7.5}`} cy={pos} r={15} stroke={answerToResponseTypeData(a)[2]} strokeWidth="3" fill={answerToResponseTypeData(a)[1]}>
                               
                </circle>
                
                <text
                                x={`${(a.percentageCorrect || 50) * 7.5}`} y={pos} dy=".3em" textAnchor="middle"
                >
                    {a.position}
                </text>
                
                        </g>))}
                
                <line transform="translate(50, 55)" x1="0" x2="780" y1={currentPosition} y2={currentPosition} stroke="#5184AF" strokeWidth="2" />
                <line transform="translate(50, 55)" x1="770" x2="780" y1={currentPosition - 10} y2={currentPosition} stroke="#5184AF" strokeWidth="2" />
                <line transform="translate(50, 55)" x1="770" x2="780" y1={currentPosition + 10} y2={currentPosition} stroke="#5184AF" strokeWidth="2" />

                {[...Array(11)].map((e, i) =>
                    <text transform="translate(50, 55)" key={i} x={i * 75} y={currentPosition + 20} textAnchor="middle">
                        {i*10}%
                    </text>
                )
                }
                <text transform="translate(50, 55)" x="525" y={currentPosition - 5} fontSize="12">
                    Percentage studenten dat de vraag juist had
                </text>
            

            </svg>
        </div>
    )
}
