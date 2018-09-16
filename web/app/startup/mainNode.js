import React                from 'react'
import PropTypes            from 'prop-types'
import createReactClass     from 'create-react-class'
import { routerMiddleware,
        ConnectedRouter
    }                       from 'react-router-redux'
import { LOCATION_CHANGE }  from 'react-router-redux/reducer'   ///shogsghois
import { addMiddleware }    from 'redux-dynamic-middlewares'
import { Provider }         from 'react-redux'
import { 
    IntlProvider,
    FormattedRelative, 
}                           from 'react-intl'
import {  
    StaticRouter 
}                           from 'react-router-dom'
import ReactOnRails         from 'react-on-rails'

import { persistStore }     from 'redux-persist'
import { PersistGate }      from 'redux-persist/es/integration/react'
import ReduxToastr          from 'react-redux-toastr'

import { 
         possibleLocale,
         translationsForUsersLocale 
    }                       from './setApp'
import App                  from './App'
import Root                 from './Root'
import { Loading }          from './../components'
import { canUseDOM }        from './../utils/executionEnvironment'

// See documentation for https://github.com/reactjs/react-redux.
// This code here binds your smart component to the redux store.
const mainNode = (_initialProps, context) => {
    const store = ReactOnRails.getStore('opinionStore')
    const { location, base, serverSide } = context

    // We render a different router depending on whether we are rendering server side
    // or client side.

    if (serverSide) { 
        //get history for server  side rendering 
        const createHistory   = require('history/createMemoryHistory').default;
        const history = createHistory({ 
            initialEntries: [ location ],   // The initial URLs in the history stack
            initialIndex: 0,                // The starting index in the history stack
            // keyLength: 6,                   // The length of location.key
            // A function to use to confirm navigation with the user. Required
            // if you return string prompts from transition hooks (see below)
            getUserConfirmation: null
        });
        addMiddleware(routerMiddleware(history) /*[, anotherMiddleware ... ]*/)


        const Router = createReactClass({
            handleLocationChange(location) {
                return this.store.dispatch({
                    type: LOCATION_CHANGE,
                    payload: location
                })
            },

            componentWillMount() {
                const { store:propsStore, history } = this.props
                this.store = propsStore || this.context.store
                this.handleLocationChange(history.location)
            },

            componentDidMount() {
                const { history } = this.props
                this.unsubscribeFromHistory = history.listen(this.handleLocationChange)
            },

            componentWillUnmount() {
                if (this.unsubscribeFromHistory) this.unsubscribeFromHistory()
            },

            render() {
                return (
                    <StaticRouter basename='/app_dev.php' location={location} context={{}} >
                        {this.props.children}
                    </StaticRouter>
                )
            }
        })
        ////////////
        Router.propTypes = {
            store: PropTypes.object,
            history: PropTypes.object,
            children: PropTypes.node
        };
        Router.contextTypes = {
            store: PropTypes.object
        };

        /////////redux-persist-cookie-storage
        return (
            <Provider store={store}>
                <IntlProvider 
                    locale={possibleLocale}
                    messages={translationsForUsersLocale}>
                    <div className="wrp-server">
                        <Router 
                            store= {store}
                            history={history} >
                            <App 
                                serverSide={true}
                                history={history}
                                store={store}
                                dispatch={store.dispatch}>
                                <Root serverSide={true} />
                            </App>
                        </Router>
                        <ReduxToastr
                            timeOut={4000}
                            newestOnTop={false}
                            preventDuplicates
                            position="bottom-right"
                            transitionIn="fadeIn"
                            transitionOut="fadeOut"
                            progressBar={false}
                            />
                    </div>
                </IntlProvider>
            </Provider>
        )
    ///////////////////
    } else {
        // const _persistor   = persistStore(store/*, [config, callback] removed since v5*/)
        const createHistory  = require('history/createBrowserHistory').default,
        supportsHistory = 'pushState' in window.history,
        history        = createHistory({
            basename: '/app_dev.php', // The base URL of the app (see below)
            forceRefresh: !supportsHistory,      // Set true to force full page refreshes
            keyLength: 12,             // The length of location.key
            // A function to use to confirm navigation with the user (see below)
            //getUserConfirmation: (message, callback) => callback(window.confirm(message))
        });
        addMiddleware(routerMiddleware(history) /*[, anotherMiddleware ... ]*/)

        return (
            <Provider store={store}>
                <IntlProvider 
                    locale={possibleLocale}
                    messages={translationsForUsersLocale}>
                    <div className="wrp-client">
                        <ConnectedRouter 
                            store= {store}
                            history={history} >
                            <App 
                                serverSide={false}
                                history={history}
                                store={store}
                                dispatch={store.dispatch}>
                                <Root serverSide={false} />
                            </App>
                        </ConnectedRouter>
                        <ReduxToastr
                            timeOut={4000}
                            newestOnTop={false}
                            preventDuplicates
                            position="bottom-right"
                            transitionIn="fadeIn"
                            transitionOut="fadeOut"
                            progressBar={false}
                            />
                    </div>
                </IntlProvider>
            </Provider>
        )
    }
}

export default mainNode