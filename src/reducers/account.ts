import { setUserAPIKey } from '../actions/account';
import { IReducerSpec } from '../types/IExtensionContext';

import update = require('react-addons-update');

/**
 * reducer for changes to the authentication
 */
export const accountReducer: IReducerSpec = {
  reducers: {
    [setUserAPIKey]: (state, payload) => update(state, { APIKey: { $set: payload } }),
  },
  defaults: {
    APIKey: '',
  },
};
