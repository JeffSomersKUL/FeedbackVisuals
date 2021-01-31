import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { FeedbackCodeInfo, ParticipationResponse, AnswerData, ISubScore } from '../Shared/data';
import ExerciseDialog from './Modals/ExerciseDialog';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Button from '@material-ui/core/Button';
import EditableMarkdownComponent from './EditableMarkdownComponent';
import { CircularProgress, StepButton, IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import SaveIcon from '@material-ui/icons/Save';
import HelpIcon from '@material-ui/icons/Help';
import ManageDialog from './Modals/ManageDialog';
import { useBeforeunload } from 'react-beforeunload';
import HelpDialog from './Modals/HelpDialog2';
import ErrorDialog from './Modals/ErrorDialog';

const containerPaperId = 'containerPaper'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    title: {
        flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        width: '90%'
    },
    container: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        maxHeight: '60vh',
        height: 'auto'
    },
    fixedHeightOuter: {
        maxHeight: '70vh',
        height: 'auto'
    },
    backButton: {
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    stepper: {
        padding: theme.spacing(1)
    }
}));

const amountOfSubsteps = (step: any) => {
    if(step.subSteps){
        return step.subSteps.length
    }
    return 1
}

interface Props {
    feedbackCodeInfo: FeedbackCodeInfo
}

export default function DashboardStepped(props: Props) {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const fixedHeightOuterPaper = clsx(classes.paper, classes.fixedHeightOuter);

    const [selectedQuestion, setSelectedQuestion] = useState<AnswerData | null>(null)
    const [selectedQuestionSubScore, setSelectedQuestionSubScore] = useState<ISubScore | null>(null)

    const [data, setData] = useState<ParticipationResponse | null>(null)
    const [feedbackCode, setFeedbackCode] = useState<string>(props.feedbackCodeInfo.feedbackCode || '')
    const [editorCode, setEditorCode] = useState<string>('')

    const [activeGlobalStep, setActiveGlobalStep] = React.useState(0);
    const [activeStep, setActiveStep] = React.useState(0);
    const [lastCompletedStep, setLastCompletedStep] = React.useState([0,0])
    const [managing, setManaging] = React.useState(false)
    const [helping, setHelping] = React.useState(false)
    const [saving, setSaving] = React.useState(false)
    const [saveError, setSaveError] = React.useState<string|undefined>(undefined)

    const [steps, setSteps] = React.useState<DashboardStep[]>([])
    const [returnedSteps, setReturnedSteps] = React.useState<DashboardStep[]>([])

    const visibleSteps = steps.filter(step => step.visible).map(step => {
        return {
            ...step,
            subSteps: step.subSteps.filter(subStep => subStep.visible)
        }
    })

    const canEdit = (data) ? data.canEdit : false
    
    // TODO
    useEffect(() => {       
        fetch(`/steps/${props.feedbackCodeInfo.session}/${props.feedbackCodeInfo.program}`)
            .then(response => response.json())
            .then(data => {
                setSteps(data)
                setReturnedSteps(data)
            })
            .catch(e => {
                console.error('Er ging iets mis bij het ophalen van de steps.')
            })
    }, [props.feedbackCodeInfo]);

    useBeforeunload(() => {
        if(hasUnsavedChanges()){
            return "Je hebt nog niet alle opgeslagen"
        }
    });

    const getFeedbackCodeInfo = () => {
        return {
            ...props.feedbackCodeInfo,
            feedbackCode,
        } as FeedbackCodeInfo
    }

    const handleNext = () => {
        let newActiveStep;
        let newGlobalStep = activeGlobalStep;
        if (activeStep + 1 < amountOfSubsteps(visibleSteps[activeGlobalStep])) {
            newActiveStep = activeStep + 1
        }
        else if(newGlobalStep < visibleSteps.length) {
            newActiveStep = 0
            newGlobalStep += 1
        }
        else{
            return
        }
        setActiveStep(newActiveStep);
        setActiveGlobalStep(newGlobalStep);

        if (!isStepComplete(newGlobalStep, newActiveStep)) {
            setLastCompletedStep([newGlobalStep, newActiveStep])
        }
        document.getElementById(containerPaperId)!.scrollTop = 0;
    }

    const handleBack = () => {
        if (activeStep - 1 < 0) {
            setActiveStep(prevActiveStep => amountOfSubsteps(visibleSteps[activeGlobalStep - 1]) - 1);
            setActiveGlobalStep(prevActiveStep => prevActiveStep - 1)
        }
        else {
            setActiveStep(prevActiveStep => prevActiveStep - 1);
        }
        document.getElementById(containerPaperId)!.scrollTop = 0;
    }

    const handleData = (code: string, data: ParticipationResponse) => {
        setData(data)
        setFeedbackCode(data.feedbackCode)
        if(code !== data.feedbackCode){
            setEditorCode(code)
        }
        handleNext()
    }

    const getShowPreviousQuestion = () => {
        if(data && data.answers){
            const currentPosition = selectedQuestion!.position!
            const lowerPositions = selectedQuestionSubScore!.vragenIds!.filter((v: number) => v < currentPosition)
            if(lowerPositions.length === 0)
                return undefined
            const newPosition = Math.max(...lowerPositions)
            const newAnswer = data.answers.find(a => a.position === newPosition)
            if(newAnswer){
                return () => setSelectedQuestion(newAnswer)
            }
            return undefined
        }
        return undefined
    }

    const getShowNextQuestion = () => {
        if (data && data.answers) {
            const currentPosition = selectedQuestion!.position!
            const higherPositions = selectedQuestionSubScore!.vragenIds!.filter((v: number) => v > currentPosition)
            if (higherPositions.length === 0)
                return undefined
            const newPosition = Math.min(...higherPositions)
            const newAnswer = data.answers.find(a => a.position === newPosition)
            if (newAnswer) {
                return () => setSelectedQuestion(newAnswer)
            }
            return undefined
        }
        return undefined
    }

    /*const handleReset = () => {
        setActiveGlobalStep(0);
        setActiveStep(0)
    }*/

    const isStepComplete = (globalIndex: number, index: number): boolean => {
        return [globalIndex, index] <= lastCompletedStep
    }

    const handleStepClick = (globalIndex: number, index: number) => {
        if (isStepComplete(globalIndex, index)){
            setActiveStep(index)
        }
    }

    const handleGlobalStepClick = (globalIndex: number) => {
        if (isStepComplete(globalIndex, 0)) {
            setActiveGlobalStep(globalIndex)
            setActiveStep(0)
        }
    }

    const saveSteps = () => {
        setSaving(true)
        fetch(`/steps/${props.feedbackCodeInfo.session}/${props.feedbackCodeInfo.program}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-FeedbackCode': editorCode,
            },
            body: JSON.stringify(steps),
        })
        .then(response => {
            setSaving(false)
            if(response.status === 406){
                setSaveError('Deze sessie kan niet meer gewijzigd worden.')
                return
            }
            return response.json().then(data => {
                setSteps(data)
                setReturnedSteps(data)
            })
        })
        .catch(e => {
            setSaveError(`Er ging iets mis bij het opslaan van de steps`)
        })
    }

    const handleStepMdChange = (key: string, value: string) => {
        setSteps(steps.map((item, index) => {
                return {
                    ...item,
                    subSteps: item.subSteps.map((s, i) => {
                        return {
                            ...s,
                            mdString: (key === s.key) ? value : s.mdString
                        }
                    })
                }
            }
        ))
    }

    const hasUnsavedChanges = (): boolean => {
        return JSON.stringify(steps) !== JSON.stringify(returnedSteps)
    }

    const showQuestion = (a: AnswerData, s: ISubScore) => {
        setSelectedQuestionSubScore(s);
        setSelectedQuestion(a);
    }

    const stepContent = (step: DashboardSubStep) => {
        return (<EditableMarkdownComponent mdString={step.mdString} data={data!} classes={classes} showQuestion={showQuestion} canEdit={canEdit} handleFeedbackCode={handleData} stepKey={step.key} updateMd={handleStepMdChange} feedbackCodeInfo={getFeedbackCodeInfo()} />)
    }

    let body;
    if (visibleSteps.length > 0){
        const currentGlobalStepContent = (subSteps: DashboardSubStep[]) => {
                return (<div><Stepper activeStep={activeStep} className={classes.stepper}>
                    {subSteps.map((step, index: number) => (
                        <Step key={step.title}>
                            <StepButton
                                onClick={(e) => handleStepClick(activeGlobalStep, index)}
                                completed={isStepComplete(activeGlobalStep, index) && index !== activeStep}
                                disabled={!isStepComplete(activeGlobalStep, index)}
                            >
                                {step.title}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                    <div>
                        {activeStep < subSteps.length &&
                                <div>
                                    <Paper id={containerPaperId} className={fixedHeightPaper}>
                                        {stepContent(subSteps[activeStep])}
                                    </Paper>
                                </div>
                            }
                    </div>
                </div>
                ) 
        }
        body = (<div>
        <Stepper activeStep={activeGlobalStep} className={classes.stepper}>
                {visibleSteps.map((step: DashboardStep, index: number) => (
                <Step key={step.title}>
                    <StepButton
                        onClick={(e) => handleGlobalStepClick(index)}
                        completed={isStepComplete(index, 0) && index !== activeGlobalStep}
                        disabled={!isStepComplete(index, 0)}
                    >
                            {step.title}
                    </StepButton>
                </Step>
            ))}
        </Stepper>
            <div>
                {activeGlobalStep === visibleSteps.length ? (
                    <div>
                        <Paper className={fixedHeightOuterPaper}>
                        <Typography className={classes.instructions}>Klaar</Typography>
                        </Paper>
                    </div>
                ) : (
                        <div>
                            <Paper className={fixedHeightOuterPaper}>
                                {currentGlobalStepContent(visibleSteps[activeGlobalStep].subSteps)}
                            </Paper>
                            <div>
                                <Button
                                    disabled={activeGlobalStep === 0 && activeStep === 0}
                                    onClick={handleBack}
                                    className={classes.backButton}
                                    data-cy="previous-button"
                                >
                                    Vorige
              </Button>
                                {!(activeGlobalStep === visibleSteps.length - 1 && activeStep === amountOfSubsteps(visibleSteps[activeGlobalStep]) - 1) &&
                                    <Button className={classes.backButton} variant="contained" color="primary" onClick={handleNext} disabled={visibleSteps[activeGlobalStep].subSteps[activeStep].mdString.indexOf('@FeedbackCode') > -1} data-cy="next-button">
                                    Volgende
                                </Button>
                                }
                            </div>
                        </div>
                    )}
            </div></div>)
    }
    else {
        body = (<div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></div>)
    }

    let dialog;
    if (data && selectedQuestion)
        dialog = <ExerciseDialog feedbackCode={feedbackCode} answer={selectedQuestion!} open={!!selectedQuestion} onClose={() => setSelectedQuestion(null)} showPrevious={getShowPreviousQuestion()} showNext={getShowNextQuestion()}/>
    if (canEdit && managing)
        dialog = <ManageDialog dashboardSteps={steps} open={managing} onClose={() => setManaging(false)} handleApply={setSteps}></ManageDialog>
    else if(canEdit && helping)
        dialog = <HelpDialog open={helping} onClose={() => setHelping(false)} />
    else if(canEdit && saveError)
        dialog = <ErrorDialog open={!!saveError} message={saveError} onClose={() => setSaveError(undefined)} />

    return (
        <div className={classes.root}>

            <AppBar position="absolute" className={clsx(classes.appBar)}>
                <Toolbar variant="dense" className={classes.toolbar}>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Feedback IJkingstoets
                        </Typography>
                    {canEdit &&
                        <IconButton onClick={() => setHelping(true)} data-cy='help-button'>
                            <HelpIcon />
                        </IconButton>
                    }
                    {canEdit &&
                        <IconButton onClick={() => setManaging(true)} data-cy='manage-button'>
                            <SettingsIcon />
                        </IconButton>
                    }
                    {
                    hasUnsavedChanges() &&
                        (<div style={{position: 'relative'}}>
                        {saving && <CircularProgress size={30} style={{ position: 'absolute', top: 9, left: 10, zIndex: 1 }} color='secondary' />}
                        <IconButton onClick={() => !saving && saveSteps()}>
                            <SaveIcon />
                        </IconButton>
                        </div>)
                    }
                        <img src='/logo-ijkingstoets.png' alt='ijkingstoetslogo' style={{height: 50}} />
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    {body}
                </Container>
            </main>
            {dialog}
        </div>
    );
}

export interface DashboardSubStep {
    title: string,
    mdString: string,
    key: string,
    visible: boolean
}

export interface DashboardStep {
    title: string,
    subSteps: DashboardSubStep[]
    visible: boolean
}