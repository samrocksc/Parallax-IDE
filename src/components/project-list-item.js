'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

class Project extends React.Component {
  render(){
    const {
      onClick,
      children
    } = this.props;

    return (
      <li icon="folder" onClick={onClick}>
        {children}
      </li>
    );
  }
}

module.exports = Project;
