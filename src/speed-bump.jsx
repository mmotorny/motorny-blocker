import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import ReactDOM from 'react-dom';

function WebsiteBlockedDialog(props) {
  const handleUnblock = () => {
    chrome.storage.local.get(null, (localStorage) => {
      console.log(`Unblocking ${props.blockedUrl.hostname}.`);
      const blockedHostnames = localStorage['blockedHostnames'] ??= {};
      delete blockedHostnames[props.blockedUrl.hostname];
      chrome.storage.local.set(localStorage);
      window.location = props.blockedUrl;  
    });
  };

  const handleUnblockOnce = () => {
    chrome.storage.local.get(null, (localStorage) => {
      console.log(`Unblocking ${props.blockedUrl.hostname} once.`);
      const blockedHostnames = localStorage['blockedHostnames'] ??= {};
      const blockedHostname = blockedHostnames[props.blockedUrl.hostname] ??= {};
      blockedHostname['unblockedUntil'] = Date.now() + 60 * 1000;
      chrome.storage.local.set(localStorage);
      window.location = props.blockedUrl;  
    });
  };

  return (
    <Dialog open={true}>
      <DialogTitle>Website blocked</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`${props.blockedUrl.hostname} is blocked by your request.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUnblock} color="secondary">
          Unblock
        </Button>
        <Button onClick={handleUnblockOnce} color="primary">
          Unblock once
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const urlParams = new URLSearchParams(window.location.search);
ReactDOM.render(
  <WebsiteBlockedDialog blockedUrl={new URL(urlParams.get('blocked-url'))} />,
  document.querySelector('#react-dom-container')
);
