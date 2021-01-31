import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ExerciseResult from 'Components/ExerciseResult';
import { AnswerData } from 'Shared/data';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { IconButton } from '@material-ui/core';

interface Props {
    feedbackCode: string
    answer: AnswerData
    open: boolean
    onClose?: () => void
    showPrevious?: () => void
    showNext?: () => void
}

export default function ExerciseDialog(props: Props) {
    const { feedbackCode, answer, open, onClose, showPrevious, showNext } = props

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () => {
        if (onClose)
            onClose();
    }
    
    // TODO: color of title depending on right, wrong, unanswered
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll='paper'
                aria-labelledby="scroll-dialog-title"
                fullScreen={fullScreen}
                maxWidth='md'
            >
                <DialogTitle id="scroll-dialog-title">Overzicht oefening {answer.position}</DialogTitle>
                <DialogContent dividers={true}>
                    {showPrevious && <IconButton onClick={showPrevious} style={{ position: 'absolute', top: '45%', left: -5 }} color="secondary">
                        <NavigateBeforeIcon fontSize='large'></NavigateBeforeIcon>
                    </IconButton>}
                    <ExerciseResult answer={answer} image={`/images/question/${answer.questionId}/${feedbackCode}`} />
                    {showNext && <IconButton onClick={showNext} style={{ position: 'absolute', top: '45%', right: 5 }} color="secondary">
                        <NavigateNextIcon fontSize='large'></NavigateNextIcon>
                    </IconButton>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Sluit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}