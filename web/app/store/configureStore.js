import thunk                from 'redux-thunk'
import jwtDecode            from 'jwt-decode'
import { Provider }         from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import ReduxToastr          from 'react-redux-toastr'
import { fromJS }           from 'immutable'
import { routerReducer, }   from 'react-router-redux'
import { 
  createStore, 
  combineReducers, 
  applyMiddleware, 
  compose 
}                           from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import {
    persistStore, 
    persistReducer,
    persistCombineReducers
}                           from 'redux-persist'
import { PersistGate }      from 'redux-persist/es/integration/react'
import { REHYDRATE, PURGE } from 'redux-persist'
import axiosMiddleware      from 'redux-axios-middleware'
import localforage          from 'localforage'

import {
  reducer as toastrReducer
}                           from 'react-redux-toastr'
import dynamicMiddlewares   from 'redux-dynamic-middlewares'

import rootSaga             from './../sagas/rootSaga'
import * as userReducers    from './../reducers/user'
import * as messageReducers from './../reducers/message'
import * as socialReducers  from './../reducers/social'
import * as postReducers    from './../reducers/post'
import * as mediaReducers   from './../reducers/media'
import initialState         from './initialState'
import { canUseDOM }        from './../utils/executionEnvironment'

// require('./../scripts/fixServerRendering.js')
const axios                 = require('axios')

/**
* Configure localforage 
*
*/
localforage.config({
    driver      : localforage.INDEXEDDB, // Force INDEXEDDB; same as using setDriver()
    name        : 'opinion',
    version     : 1.0,
    //size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
    description : "this is the opinion\'s database in web browser"
});


// const appReducer = combineReducers()
export const persistorConfig = {
    key: 'root', // key is required
    storage: localforage, // storage is now required
    debug: true 
}

//compose all reducers in  one object from its folder 
const reducers = Object.assign({}, 
    socialReducers, 
    userReducers,
    messageReducers, 
    postReducers, 
    mediaReducers
);  //put all reducers in object


const reducer = persistCombineReducers(persistorConfig, {
                    ...reducers,
                    toastr: toastrReducer, // <- Mounted at toastr.
                    routing: routerReducer,
                    form: reduxFormReducer, // mounted under "form"
                })

/** 
* More infos see in S.O :: how to reset the state of redux store
*/
const rootReducer = (state, action) => {

    if(action.type === 'USER::LOGOUT') {
        state = undefined
    }

    if(action.type === 'persist/REHYDRATE') {
        //console.log('rehydrated payload', action.payload) 
    }

    return reducer(state, action)
}

//create client to apply middleware for each request
export const client = axios.create({ //all axios can be used, shown in axios documentation
    baseURL: 'http://opinion.com/app_dev.php/api/',
    responseType: 'json'
});

// let _persitor

/**
* Configure store
* return persitor & store
*/
export default function configureStore(props, context) {

    // This is how we get initial props from Symfony into redux.
    // const { recipes, recipe, } = props
    const { base, location } = context
    // create the saga middleware
    const sagaMiddleware = createSagaMiddleware()
    const imState = fromJS(initialState);

    // Redux expects to initialize the store using an Object
    for(var key in props) {
        if(initialState.hasOwnProperty(key)) {
            imState.get(key).merge(props[key]);
        } else {
            //imState.set(key, props[key]);
        }
    }

    const state        = imState.toJS();
    const _initialState  = { ...state, ...props };

    //create store
    const store = createStore(
        rootReducer,
        _initialState,
        compose(
            applyMiddleware(  //all middlewares...
                axiosMiddleware(client), 
                sagaMiddleware, 
                thunk,
                dynamicMiddlewares
            ),
            //,...second parameter options can optionally contain onSuccess, onError, onComplete, successSuffix, errorSuffix
            //autoRehydrate(), removed since v5.0.0 // add `autoRehydrate` as an enhancer to your store (note: `autoRehydrate` is not a middleware                 
            (typeof window !== 'undefined' && window.devToolsExtension) ? window.devToolsExtension() : f => f //if devtools's installed
        )
    )

    // console.log(store);


    //dispatch REHYDRATE to add initialState from server to persistor
    // store.dispatch({
    //     type: 'persist/REHYDRATE',
    //     key: persistorConfig.key,
    //     payload: _initialState
    // })
    // const _persistor   = persistStore(store/*, [config, callback] removed since v5*/)

    // Before running a Saga, We must mount the Saga middleware on the Store using applyMiddleware
    sagaMiddleware.run(rootSaga)

    return store;
}

// export const persitor = _persistor