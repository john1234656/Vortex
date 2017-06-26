import {setStateVersion} from '../actions/app';
import {IState} from '../types/IState';

import {getSafe} from './storeHelper';

import {app} from 'electron';
import * as Redux from 'redux';

interface IMigrator {
  apply: (store: Redux.Store<any>, previousVersion: string) => void;
}

const settingsMigrator: { [oldVersion: string]: IMigrator } = {};

function updateStore(store: Redux.Store<IState>): Redux.Store<IState> {
  const oldVersion = getSafe(store.getState(), ['persistent', 'app', 'version'], '');
  const newVersion = app.getVersion();
  if (oldVersion !== newVersion) {
    const migrator = settingsMigrator[newVersion];
    if (migrator !== undefined) {
      migrator.apply(store, oldVersion);
    }
    store.dispatch(setStateVersion(newVersion));
  }
  return store;
}

export default updateStore;
