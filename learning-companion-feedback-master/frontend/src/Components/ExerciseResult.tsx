import * as React from 'react'
import {AnswerData} from '../Shared/data'
import AnswerBar from './AnswerBar'
import { Table, TableRow, TableCell } from '@material-ui/core'
import { answerToResponseTypeData } from './ExercisesMap'

interface Props {
    answer: AnswerData,
    image: string
}

export default function ExerciseResult(props: Props) {
    const { answer, image } = props
    const [visible, setVisible] = React.useState(true)

    return (<div style={{minWidth: 700, minHeight:50}}>        
        <img src={image} key={image} style={{ maxWidth: '95%', ...((!visible) ? { display: 'none' } : {}) }} alt={`question ${answer.questionId}`} onLoad={() => setVisible(true)} onError={() => setVisible(false)} />
        <Table>
            <TableRow><TableCell>Juiste Antwoord</TableCell><TableCell align="center">{answer.correctAnswer ? answer.correctAnswer! : 'onbekend'}</TableCell></TableRow>
            <TableRow><TableCell>Jouw Antwoord</TableCell><TableCell align="center" style={{ color: answerToResponseTypeData(answer)[2].substr(0, 7)}}>{answer.givenAnswer === 'X' ? 'Blanco' : answer.givenAnswer}</TableCell></TableRow>
            <TableRow><TableCell>Percentage juist</TableCell><TableCell align="center">{answer.percentageCorrect ? answer.percentageCorrect! : 'onbekend'}</TableCell></TableRow>
            <TableRow><TableCell>Percentage blanco</TableCell><TableCell align="center">{answer.percentageBlanco ? answer.percentageBlanco! : 'onbekend'}</TableCell></TableRow>
        </Table>
        <AnswerBar answer={answer} />        
    </div>)
}