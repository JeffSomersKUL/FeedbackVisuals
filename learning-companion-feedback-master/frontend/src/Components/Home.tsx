import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { RouteComponentProps, withRouter } from 'react-router';

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
    }
}));

export default withRouter(function Home(props: RouteComponentProps) { //TODO, remove page ?
    const classes = useStyles();
   
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
                    
                </Container>
            </main>
        </div>
    );
})
