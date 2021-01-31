import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
    message: string
    open: boolean
    onClose?: () => void
}

export default function ErrorDialog(props: Props) {
    const { message, open, onClose } = props

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
                maxWidth='md'
            >
                <DialogTitle id="scroll-dialog-title">Error</DialogTitle>
                <DialogContent dividers={true}>
                    {message}   
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