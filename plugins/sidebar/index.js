'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

const Sidebar = require('./sidebar');
const FileList = require('./file-list');
const File = require('./file');
const FileOperations = require('./file-operations');
const ProjectOperations = require('./project-operations');

const deviceStore = require('../../src/stores/device');
const editorStore = require('../../src/stores/editor');
const fileStore = require('../../src/stores/file');

const { loadFile } = require('../../src/actions/file');

function sidebar(app, opts, done){

  const space = app.workspace;
  const toast = app.toast;
  const overlay = app.overlay;
  const userConfig = app.userConfig;
  const irken = app;
  const getBoard = app.getBoard.bind(irken);
  const scanBoards = app.scanBoards.bind(irken);

  function refreshDirectory(){
    // TODO: expose a method to refresh directory without changing it
    space.changeDir(space.cwd.deref());
  }

  // TODO: move into frylord?
  chrome.syncFileSystem.onFileStatusChanged.addListener(function(detail){
    if(detail.direction === 'remote_to_local'){
      refreshDirectory();
    }
  });
  chrome.syncFileSystem.onServiceStatusChanged.addListener(refreshDirectory);

  app.view('sidebar', function(el, cb){
    console.log('sidebar render');
    const directory = space.directory;

    const Component = (
      <Sidebar>
        <ProjectOperations workspace={space} overlay={overlay} config={userConfig} />
        <FileList workspace={space} loadFile={loadFile}>
          <ListItem icon="folder" disableRipple>{space.cwd.deref()}</ListItem>
          {directory.map((file) => <File key={file.get('name')} filename={file.get('name')} temp={file.get('temp')} loadFile={loadFile} />)}
        </FileList>
        <FileOperations irken={irken} loadFile={loadFile} overlay={overlay}
                    toast={toast} workspace={space} />
      </Sidebar>
    );

    React.render(Component, el, cb);
  });

  // Store bindings
  deviceStore.workspace = space;
  deviceStore.toast = toast;
  deviceStore.overlay = overlay;
  deviceStore.getBoard = getBoard;
  deviceStore.scanBoards = scanBoards;

  editorStore.workspace = space;

  fileStore.workspace = space;
  fileStore.userConfig = userConfig;

  fileStore.toast = toast;

  done();
}

module.exports = sidebar;
