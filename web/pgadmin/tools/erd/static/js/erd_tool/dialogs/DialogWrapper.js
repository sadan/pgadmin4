/////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2020, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

import gettext from 'sources/gettext';
import url_for from 'sources/url_for';

export default class DialogWrapper {
  constructor(dialogContainerSelector, dialogTitle, typeOfDialog,
    jquery, pgBrowser, alertify, backform, backgrid) {

    this.dialogContainerSelector = dialogContainerSelector;
    this.dialogTitle = dialogTitle;
    this.jquery = jquery;
    this.pgBrowser = pgBrowser;
    this.alertify = alertify;
    this.backform = backform;
    this.backgrid = backgrid;
    this.typeOfDialog = typeOfDialog;
  }

  main(title, dialogModel, okCallback) {
    this.set('title', title);
    this.dialogModel = dialogModel;
    this.okCallback = okCallback;
  }

  build() {
    this.alertify.pgDialogBuild.apply(this);
  }

  setup() {
    let get_help_file = function (dialog_type) {
      if (dialog_type == 'globals') {
        return 'backup_globals_dialog.html';
      } else if (dialog_type == 'server') {
        return 'backup_server_dialog.html';
      }
      return 'backup_dialog.html';
    };
    return {
      buttons: [{
        text: '',
        className: 'btn btn-secondary pull-left fa fa-info pg-alertify-icon-button',
        attrs: {
          name: 'object_help',
          type: 'button',
          url: 'backup.html',
          label: gettext('Backup'),
          'aria-label': gettext('Backup'),
        },
      }, {
        text: '',
        key: 112,
        className: 'btn btn-secondary pull-left fa fa-question pg-alertify-icon-button',
        attrs: {
          name: 'dialog_help',
          type: 'button',
          label: gettext('Help'),
          'aria-label': gettext('Help'),
          url: url_for('help.static', {
            'filename': get_help_file(this.typeOfDialog),
          }),
        },
      }, {
        text: gettext('Cancel'),
        key: 27,
        className: 'btn btn-secondary fa fa-lg fa-times pg-alertify-button',
        'data-btn-name': 'cancel',
      }, {
        text: gettext('OK'),
        key: 13,
        className: 'btn btn-primary fa fa-lg fa-save pg-alertify-button',
        'data-btn-name': 'ok',
      }],
      // Set options for dialog
      options: {
        title: this.dialogTitle,
        //disable both padding and overflow control.
        padding: !1,
        overflow: !1,
        model: 0,
        resizable: true,
        maximizable: true,
        pinnable: false,
        closableByDimmer: false,
        modal: false,
      },
    };
  }

  prepare() {
    const $container = this.jquery(this.dialogContainerSelector);
    const dialog = this.createDialog($container);
    dialog.render();
    this.elements.content.innerHTML = '';
    this.elements.content.appendChild($container.get(0));

    this.jquery(this.elements.body.childNodes[0]).addClass(
      'alertify_tools_dialog_properties obj_properties'
    );
  }

  callback(event) {
    if (this.wasOkButtonPressed(event)) {
      this.okCallback(this.view.model.toJSON(true));
    }
  }

  disableOKButton() {
    this.__internal.buttons[3].element.disabled = true;
  }

  enableOKButton() {
    this.__internal.buttons[3].element.disabled = false;
  }

  createDialog($container) {
    let fields = this.backform.generateViewSchema(
      null, this.dialogModel, 'create', null, null, true, null
    );

    this.view = new this.backform.Dialog({
      el: $container,
      model: this.dialogModel,
      schema: fields,
    });

    return this.view;
  }

  wasOkButtonPressed(event) {
    return event.button['data-btn-name'] === 'ok';
  }
}
