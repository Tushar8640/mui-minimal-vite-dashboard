import  { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

// Custom hook to handle the confirmation dialog
const useConfirmationDialog = () => {
  const [open, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return {
    open,
    openDialog,
    closeDialog,
  };
};

export default function ConfirmationDialog() {
  const { open, openDialog, closeDialog } = useConfirmationDialog();

  return (
    <div>
      <Button variant="outlined" onClick={openDialog}>
        Show Confirmation Dialog
      </Button>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">
          Confirm Action
        </DialogTitle>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Disagree
          </Button>
          <Button onClick={closeDialog} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
