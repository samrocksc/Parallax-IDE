'use strict';

const alt = require('../alt');

class OverlayActions {
  hideOverlays(){
    this.dispatch();
  }

  showSave(){
    this.dispatch();
  }

  hideSave(status){
    this.dispatch(status);
  }

  showDelete(){
    this.dispatch();
  }

  hideDelete(){
    this.dispatch();
  }

  showDownload(){
    this.dispatch();
  }

  hideDownload(){
    this.dispatch();
  }
}

module.exports = alt.createActions(OverlayActions);
