import React from 'react';
import ReactDOM from 'react-dom';
import BodyWidget from './ui_components/BodyWidget';
import getDialog from './dialogs';
import Alertify from 'pgadmin.alertifyjs';
import pgWindow from 'sources/window';

export default class ERDTool {
  constructor(container, params) {
    this.container = document.querySelector(container);
    this.params = params;
  }

  render() {
    ReactDOM.render(
      <BodyWidget params={this.params} getDialog={getDialog} pgAdmin={pgWindow.pgAdmin} alertify={Alertify} />,
      this.container
    );
  }
}
