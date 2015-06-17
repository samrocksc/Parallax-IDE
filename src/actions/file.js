'use strict';

const alt = require('../alt');

class FileActions {
  clearName() {
    this.dispatch();
  }

  newFile() {
    this.dispatch();
  }

  processCreate(name) {
    this.dispatch(name);
  }

  processSave() {
    this.dispatch();
  }

  updateName(value) {
    this.dispatch(value);
  }

}

module.exports = alt.createActions(FileActions);
