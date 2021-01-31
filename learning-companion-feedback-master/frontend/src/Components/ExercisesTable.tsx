import * as React from 'react'
import { AnswerData, ISubScore } from 'Shared/data';
import { Typography, TableHead, TableCell, TableRow, Table, TableBody, Slider, withStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { answerToResponseTypeData, answerToResponseType, ResponseType } from './ExercisesMap';
import CheckIcon from '@material-ui/icons/Check';

interface Props {
    subscore: ISubScore
    answers: AnswerData[]
    onQuestionClick: (a: AnswerData) => void
}

const useStyles = makeStyles({
    table: {
    },
});

const ProgressSlider = withStyles({
    root: {
        width: 70,
        marginRight: 10,
        padding: 3
    },
    thumb: {
        display: 'none'
    }
})(Slider);

export default function ExercisesTable(props: Props) {
    const classes = useStyles();

    const { subscore, answers, onQuestionClick } = props
    
    if(!subscore.vragenIds)
        return (<Typography>Er zijn geen vragen gekoppeld aan deze subscore</Typography>)

    const rows: AnswerData[] = subscore.vragenIds.map(i => {
        return answers[i - 1]
    })
    rows.sort((r1, r2) => r1.position - r2.position)

    const toBlankUndefined = <T extends any>(i: T | undefined): T | '' => {
        if(i === undefined)
            return ''
        return i
    }

    return (
        <div
            style={{
                height: 300,
                width:'100%',
                overflow: 'auto',
            }}
        >
                <Table className={classes.table} stickyHeader aria-label="oefeningentabel">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Vraag</TableCell>
                        <TableCell align="center">Correcte Antwoord</TableCell>
                        <TableCell align="center">Gegeven Antwoord</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="left">Percentage Juist</TableCell>
                        <TableCell align="left">Percentage Blanco</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.questionId} onClick={() => onQuestionClick(row)} style={{cursor:"pointer"}}>
                                <TableCell align="center" component="th" scope="row">
                                    {row.position}
                                </TableCell>
                                <TableCell align="center">{toBlankUndefined(row.correctAnswer)}</TableCell>
                                <TableCell align="center" style={{ color: answerToResponseTypeData(row)[2].substr(0,7) }}>
                                    {row.givenAnswer}
                                </TableCell>
                                <TableCell align="center">
                                    {answerToResponseType(row) === ResponseType.RIGHT && (<CheckIcon style={{ fontSize: '0.8em' }}></CheckIcon>)}
                                </TableCell>
                                <TableCell align="left">
                                    {typeof toBlankUndefined(row.percentageCorrect) === 'number' && <ProgressSlider
                                    value={toBlankUndefined(row.percentageCorrect) as number}/>}
                                    {toBlankUndefined(row.percentageCorrect)}</TableCell>
                                <TableCell align="left">
                                    {typeof toBlankUndefined(row.percentageBlanco) === 'number' && <ProgressSlider
                                    value={toBlankUndefined(row.percentageBlanco) as number} />}
                                        {toBlankUndefined(row.percentageBlanco)}
                                    </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
        </div>
    )
}