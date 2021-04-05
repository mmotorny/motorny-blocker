import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import ReactDOM from 'react-dom';

function WebsiteBlockedDialog(props) {
  const handleClose = () => {
    window.close();
  };

  const handleUnblock = () => {
    //window.location = props.blockedUrl;
    console.log(`chrome.runtime = ${chrome.runtime}`);
  };

  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogTitle>Website blocked</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`${new URL(props.blockedUrl).hostname} is blocked by your request.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUnblock} color="primary">
          Unblock for 15 minutes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const urlParams = new URLSearchParams(window.location.search);
ReactDOM.render(
  <WebsiteBlockedDialog blockedUrl={urlParams.get('blocked-url')} />,
  document.querySelector('#react-dom-container')
);
