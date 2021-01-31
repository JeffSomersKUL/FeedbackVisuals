import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import { PDFViewer } from '@react-pdf/renderer';
import { HelpDocument } from './HelpDocument';

interface Props {
    open: boolean
    onClose?: () => void
}

export default function HelpDialog(props: Props) {
    const { open, onClose } = props

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () => {
        if (onClose)
            onClose();
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll='paper'
                aria-labelledby="scroll-dialog-title"
                fullScreen={fullScreen}
                maxWidth='md'
                data-cy='help-dialog'
            >
                <DialogTitle id="scroll-dialog-title">Help</DialogTitle>
                <DialogContent dividers={true}>
                    <PDFViewer width={700} height={700}><HelpDocument></HelpDocument></PDFViewer>
                    {/*<PDFDownloadLink document={<HelpDocument/>} fileName={"handleiding-feedbackdashboard-ijkingstoets"}>
                        {({ blob, url, loading , error}) => loading ? "Document aan het laden" : "Download document"}
    </PDFDownloadLink>*/}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" data-cy='help-dialog-close'>
                        Sluit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

