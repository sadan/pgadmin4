import EntityDialog from './EntityDialog';
import OneToManyDialog from './OneToManyDialog';
import ManyToManyDialog from './ManyToManyDialog';
import pgBrowser from 'top/browser/static/js/browser';

export default function getDialog(dialogName) {
  if(dialogName === 'entity_dialog') {
    return new EntityDialog(pgBrowser);
  } else if(dialogName === 'onetomany_dialog') {
    return new OneToManyDialog(pgBrowser);
  } else if(dialogName === 'manytomany_dialog') {
    return new ManyToManyDialog(pgBrowser);
  }
}
