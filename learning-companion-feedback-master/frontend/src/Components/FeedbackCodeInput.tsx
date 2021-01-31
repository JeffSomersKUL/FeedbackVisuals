import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography, Link } from '@material-ui/core';
import { ProcessedData, parseFeedbackCode, FeedbackCodeInfo, ParticipationResponse } from '../Shared/data';

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    }
}));

interface Props {
    feedbackCodeInfo: FeedbackCodeInfo
    onDataRetrieval: (feedbackCode: string, data: ProcessedData) => void
}

enum CodeErrors {
    UNKNOWN,
    INVALID,
    OTHER_TEST,
    TOO_MANY_TRIES,
}

const getErrorMessage = (codeError: CodeErrors, data: any) => {
    switch (codeError) {
        case CodeErrors.OTHER_TEST:
            return (<Typography>Deze code komt overeen met een andere ijkingstoets of met een andere sessie. Klik <Link href={`/${data.session}/${data.program}`} data-cy='code-error-redirect'>hier</Link> voor de juiste webpagina.</Typography>)
        case CodeErrors.TOO_MANY_TRIES:
            return (<Typography>Je hebt te vaak een feedbackcode ingegeven, probeer opnieuw over 15 minuten.</Typography>)
        default:
            return (<Typography>Er ging iets mis. Ben je zeker dat dit de juiste code is ?</Typography>)
    }    
}

export default function FeedbackCodeInput(props: Props) {
    const classes = useStyles();
    const { feedbackCodeInfo, onDataRetrieval } = props
    const { program, session } = feedbackCodeInfo
    const [feedbackCode, setFeedbackCode] = useState<string>(feedbackCodeInfo.feedbackCode || '')
    const [codeError, setCodeError] = useState<CodeErrors | undefined>()
    const [codeErrorData, setCodeErrorData] = useState<any>({})

    const handleCodeSubmission = () => {
        fetch(`/data/${session}/${program}/${feedbackCode}`)
            .then(response => {
                if(!response.ok){
                    const error = new Error(`Statuscode: ${response.status}`)
                    throw error
                }
                return response.json()
            })
            .then(data => {
                setCodeError(undefined)
                onDataRetrieval(feedbackCode, data as ParticipationResponse)
            })
            .catch((e: Error) => {
                if(e.message.startsWith("Statuscode:")){
                    const code = Number(e.message.replace("Statuscode: ", ""))
                    if(code === 404){
                        const data = parseFeedbackCode(feedbackCode)
                        if (data) {
                            if (program !== data.program || session !== data.session) {
                                setCodeError(CodeErrors.OTHER_TEST)
                                setCodeErrorData({ session: data.session, program: data.program })
                                return
                            }
                        }
                        else{
                            setCodeError(CodeErrors.INVALID)
                            setCodeErrorData({})
                        }
                        return
                    } else if (code === 429) {
                        setCodeError(CodeErrors.TOO_MANY_TRIES)
                        setCodeErrorData({})
                        return
                    }
                }
                setCodeError(CodeErrors.UNKNOWN)
                setCodeErrorData({})
                
                
            })
    }

    const handleEnter = (e: any) => {
        if(e.key === 'Enter'){
            handleCodeSubmission()
        }
    }

    return (<div>
        {codeError !== undefined && (
            <div data-cy='feedback-error'>
                {(getErrorMessage(codeError, codeErrorData))}
            </div>)}
        <TextField
            id="outlined-name"
            label="Code"
            value={feedbackCode}
            onChange={(e: any) => setFeedbackCode(e.target.value)}
            onKeyPress={handleEnter}
            className={classes.textField}
            margin="normal"
            variant="outlined"
            data-cy='feedback-input'
        /><br/>
        <Button variant="contained" color="primary" className={classes.button} disabled={feedbackCode.length===0} onClick={handleCodeSubmission} data-cy='feedback-button'>
            Verstuur
      </Button>
    </div>);
}