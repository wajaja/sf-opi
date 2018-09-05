import React                from 'react' 
import thunk                from 'redux-thunk'
import jwtDecode            from 'jwt-decode'
import { Provider }         from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { 
  createStore, 
  combineReducers, 
  applyMiddleware, 
  compose 
}                           from 'redux'
import {
    persistStore, 
    persistReducer,
    persistCombineReducers
}                           from 'redux-persist'
import { REHYDRATE, PURGE } from 'redux-persist/lib/constants'
import { addLocaleData }    from 'react-intl'

import rootSaga              from './../sagas/rootSaga'

/**
 * Stuff for i8n
 */
import localeData from './../../builds/lang/data.json';
const language =    (typeof document  !== 'undefined' && document.documentElement && document.documentElement.getAttribute('lang')) || 
                    (typeof navigator !== 'undefined' && navigator.languages && navigator.languages[0]) ||
                    (typeof navigator !== 'undefined' && navigator.userLanguage) || 
                    (typeof navigator !== 'undefined' && navigator.language) || 
                    'en';

// Split locales with a region code
export const possibleLocale = language.toLowerCase().split(/[_-]+/)[0];

// if(typeof window !== 'undefined') {
//     window.possibleLocale = possibleLocale   //store language
// } 

// if(typeof window === 'undefined') {
//     global.window = {}
// }

// if(typeof document === 'undefined') {
//     global.document = {}
// }
//Try locale without region code (possibleLocale), try full locale, fallback to 'en'
export const translationsForUsersLocale =  localeData[possibleLocale] || 
                                    localeData[language] || 
                                    localeData.en;

//addLocaleData(require(`react-intl/locale-data/${possibleLocale}`));
//ref: Dynamically add imports react-intl/locale-data/<locale> #777
import(`react-intl/locale-data/${possibleLocale}`).then((locale_data) => {
    addLocaleData(locale_data);
});