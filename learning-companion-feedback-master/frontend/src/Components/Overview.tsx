import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { TableCell, Table, TableHead, TableBody, TableRow, CircularProgress, Backdrop, TextField, Button } from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router';
import FeedbackProcessButton from './FeedbackProcessButton';
import FeedbackFileSubmit from './FeedbackFileSubmit';
import { Program } from 'Shared/data';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24,
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
    backdrop: {
        zIndex: theme.zIndex.drawer + 2,
        color: '#fff',
    },
}));

export default withRouter(function Overview(props: RouteComponentProps) {
    const classes = useStyles();

    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState<string>('')
   
    const [programData, setProgramData] = useState<Program[]>([])
    const loadPrograms = () =>{
        setLoading(true)
        fetch(`/programs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-FeedbackCode': code,
            }})
            .then(response => response.json())
            .then(data => {
                setProgramData(data)
                setLoading(false)
            })
            .catch(e => {
                console.error('Er ging iets mis bij het ophalen van de programs.')
                setLoading(false)
            })
    }

    return (
        <div className={classes.root}>

            <AppBar position="absolute" className={clsx(classes.appBar)}>
                <Toolbar variant="dense" className={classes.toolbar}>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Feedback IJkingstoets
                        </Typography>                    
                        <img src='logo-ijkingstoets.png' alt='ijkingstoetslogo' style={{height: 50}} />
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <TextField value={code} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCode(event.target.value)} label="" /><Button onClick={() => loadPrograms()}>Laad</Button>
                {programData.length > 0 && 
                    <Table>
                        <TableHead>
                            <TableRow key="header">                            
                                <TableCell style={{width:'25%'}}>Toets</TableCell>
                                <TableCell>Sessie</TableCell>
                                <TableCell style={{ width: '25%' }}>Upload</TableCell>
                                <TableCell># files</TableCell>
                                <TableCell>Laatst wijziging</TableCell>
                                <TableCell>Verwerk</TableCell>
                                <TableCell># Deelnemers</TableCell>
                                <TableCell>Laatst wijziging</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {programData.flatMap(p =>
                                p.sessions.map(s => (
                                    <TableRow
                                        key={`${s.session}-${p.code}`}
                                    >
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell>{s.session}</TableCell>
                                        <TableCell>
                                            <FeedbackFileSubmit code={code} session={s.session} program={p.code} changeLoading={(loading: boolean) => { setLoading(loading); !loading && loadPrograms() }}></FeedbackFileSubmit></TableCell>
                                        <TableCell>{s.files.feedbackFiles.length}</TableCell>
                                        <TableCell>{(s.files.feedbackFilesLastChanged) ? new Date(s.files.feedbackFilesLastChanged).toLocaleString("nl-BE"): ''}</TableCell>
                                        <TableCell>
                                            <FeedbackProcessButton code={code} session={s.session} program={p.code} feedbackFiles={s.files.feedbackFiles} changeLoading={(loading: boolean) => { setLoading(loading); !loading && loadPrograms() }} feedbackFilesLastChanged={s.files.feedbackFilesLastChanged} personalFeedbackFilesLastChanged={s.files.personalFeedbackFilesLastChanged} />
                                        </TableCell>
                                        <TableCell>{s.files.personalFeedbackFiles.length}</TableCell> 
                                        <TableCell>{(s.files.personalFeedbackFilesLastChanged) ? new Date(s.files.personalFeedbackFilesLastChanged).toLocaleString("nl-BE"): ''}</TableCell>
                                    </TableRow>)
                                )
                            )} 
                        </TableBody>
                    </Table> }
                </Container>
            </main>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
})
