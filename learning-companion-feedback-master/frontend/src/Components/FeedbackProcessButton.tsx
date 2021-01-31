import React, { CSSProperties } from 'react';
import { Button } from '@material-ui/core';
import { mandatoryFeedbackFileTypes } from 'Shared/data';

const sendProcessRequest = (code: string, session: number, program: string) => {
    return fetch(`/process/${session}/${program}`, {
            method: 'POST',
            headers: {
                'X-FeedbackCode': code,
            },
        })            
}

interface Props {
    code: string
    session: number
    program: string
    feedbackFiles: string[]
    changeLoading: (loading: boolean) => void
    feedbackFilesLastChanged: string
    personalFeedbackFilesLastChanged: string
}

export default function FeedbackProcessButton(props: Props) {
    const handleSubmit = () => {
        props.changeLoading(true)
        sendProcessRequest(props.code, props.session, props.program)
        .then(response => {
            props.changeLoading(false)
        })
        .catch(error => {
            console.log(error)
        });      
        
    }

    const shouldHighlight = props.feedbackFilesLastChanged && (props.personalFeedbackFilesLastChanged === '' || new Date(props.personalFeedbackFilesLastChanged).toISOString() < new Date(props.feedbackFilesLastChanged).toISOString())
    const style: CSSProperties = { color: shouldHighlight ? 'black': 'grey'}
    if(shouldHighlight){
        style.fontWeight = 'bolder'
    }

    return (<Button onClick={handleSubmit} disabled={props.feedbackFiles.map(f => f === `${props.session}-${props.program}-${mandatoryFeedbackFileTypes}`).reduce((b1, b2) => b1 && b2, true)} style={style}>Verwerk</Button>);
}
