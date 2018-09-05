import { REHYDRATE, PURGE } from 'redux-persist'
import Immutable, 
    { List, Map, Set, fromJS } 
                            from 'immutable'
import _                    from 'lodash'
import {
    User as UserActions,
    Setting as SettingActions
}                           from '../../actions/user'

/**
 * initialState
 * @type {{id: string, fb_uid: string, first_name: string, last_name: string, email: string}}
 */
export const initialState = {
    user: {},
    setting: {},
    newsRefs: [],
}



/**
 * User
 * Redux Reducer for User action
 * Reference: http://redux.js.org/docs/basics/Reducers.html
 * @param state
 * @param action
 * @returns {*}
 * @constructor
 */
function User(state = initialState, action) {

    switch (action.type) {
        
        case UserActions.LOGIN:
            return Object.assign({}, state, action.response)

        case UserActions.GET_ME_RESPONSE: {
            const data = {};

            _.each(Object.keys(action.user), k => {
                data[_.camelCase(k)] = action.user[k];
            })

            const mergedUser = fromJS(state).merge(fromJS(data));
            return Object.assign({}, state, mergedUser.toJS());
        }

        case UserActions.ADD_POST_REF: {
            const o   = {},
            refs      = fromJS(state).get('newsRefs');

            o['id']   = action.postId
            o['type'] = action.postType
            const newsRefs  = List([o]).concat(refs);
            return Object.assign({}, state, {
                newsRefs: newsRefs.toJS()
            })
        }

        case UserActions.ADD_MORE_REF: {
            const o   = {},
            refs      = fromJS(state).get('newsRefs');

            o['id']   = action.postId
            o['type'] = action.postType
            const newsRefs  = refs.concat(List([o]));
            return Object.assign({}, state, {
                newsRefs: newsRefs.toJS()
            })
        }

        case UserActions.ADD_MORE_REFS: {
            const o   = {}
            // refs      = fromJS(state).get('newsRefs');

            // o['id']   = action.postId
            // o['type'] = action.postType
            // const newsRefs  = refs.concat(List([o]));
            // return Object.assign({}, state, {
            //     newsRefs: newsRefs.toJS()
            // })
        }

        case UserActions.DELETE_POST_REF: {
            const refs = state.newsRefs,
            newsRefs = refs.filter((p, i)=> {
                return p.id !== action.postId && p.type !== action.postType
            });

            return Object.assign({}, state, {
                newsRefs: newsRefs
            })
        }

        

        case UserActions.LOGOUT:
            return Object.assign({}, state, initialState)

        case SettingActions.SUBMIT_ADRESS_REQUEST: {
            const setting = {
                'adress': {
                    'submitting': true
                }
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.SUBMIT_ADRESS_RESPONSE: {
            const data = action.data.adress;
            data['submitting'] = false;
            data['errors'] = action.data.errors;
            const setting = {
                'adress': data
            };
            return Object.assign({}, state, {
                setting: setting,
                user: action.data.user
            })
        }

        case SettingActions.SUBMIT_NAME_REQUEST: {
            const setting = {
                'name': {
                    'submitting': true
                }
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.SUBMIT_NAME_RESPONSE: {
            const data = action.data.name;
            data['submitting'] = false;
            data['errors'] = action.data.errors;
            const setting = {
                'name': data
            };
            return Object.assign({}, state, {
                setting: setting,
                user: action.data.user
            })
        }

        // case SettingActions.SUBMIT_NAME_REQUEST: {
        //     const setting = {
        //         'name': {
        //             'submitting': true
        //         }
        //     };
        //     return Object.assign({}, state, {setting: setting})
        // }

        // case SettingActions.SUBMIT_NAME_RESPONSE: {
        //     const data = action.data.name;
        //     data['submitting'] = false;
            data['errors'] = action.data.errors;
        //     const setting = {
        //         'name': data
        //     };
        //     return Object.assign({}, state, {
        //         setting: setting,
        //         user: action.data.user
        //     })
        // }

        case SettingActions.SUBMIT_LANG_REQUEST: {
            const setting = {
                'lang': {
                    'submitting': true
                }
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.SUBMIT_LANG_RESPONSE: {
            const data = action.data.lang;
            data['submitting'] = false;
            data['errors'] = action.data.errors;
            const setting = {
                'lang': data
            };
            return Object.assign({}, state, {
                setting: setting,
                user: action.data.user
            })
        }

        case SettingActions.SUBMIT_PASSWORD_REQUEST: {
            const setting = {
                'password': {
                    'submitting': true
                }
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.SUBMIT_PASSWORD_RESPONSE: {
            const data = action.data;
            if(data) {
                data['submitting'] = false;
                data['errors'] = action.data.errors;
                const setting = {
                    'password': data
                };
            }

            return Object.assign({}, state, {
                setting: setting,
                user: action.data.user
            })
        }

        case SettingActions.SUBMIT_PHONE_REQUEST: {
            const setting = {
                'phone': {
                    'submitting': true
                }
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.SUBMIT_PHONE_RESPONSE: {
            const data = action.data.phone;
            data['submitting'] = false;
            data['errors'] = action.data.errors;
            const setting = {
                'phone': data
            };
            return Object.assign({}, state, {
                setting: setting,
                user: action.data.user
            })
        }

        case SettingActions.SUBMIT_STATUS_REQUEST: {
            const setting = {
                'status': {
                    'submitting': true
                }
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.SUBMIT_STATUS_RESPONSE: {
            const data = action.data.status;
            data['submitting'] = false;
            data['errors'] = action.data.errors;
            const setting = {
                'status': data
            };
            return Object.assign({}, state, {
                setting: setting,
                status: action.data.status,
                user: action.data.user,
            })
        }

        case SettingActions.SUBMIT_ABOUT_ME_REQUEST: {
            const setting = {
                'aboutme': {
                    'submitting': true
                }
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.SUBMIT_ABOUT_ME_RESPONSE: {
            const data = action.data.aboutme;
            data['submitting'] = false;
            data['errors'] = action.data.errors;
            const setting = {
                'aboutme': data
            };
            return Object.assign({}, state, {
                setting: setting,
                user: action.data.user
            })
        }

        case SettingActions.SUBMIT_NOTIF_BY_EMAIL_REQUEST: {
            const setting = {
                'notification': {
                    'email' : {
                        'submitting': true
                    }
                }
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.SUBMIT_NOTIF_BY_EMAIL_RESPONSE: {
            const data = action.data.notification;
            data['email']['submitting'] = false;
            const setting = {
                'notification': data
            };
            return Object.assign({}, state, {
                setting: setting,
                user: action.data.user
            })
        }

        case SettingActions.SECURITY_REQUEST: {
            const setting = {
                'loadData': true
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.SECURITY_RESPONSE: {
            const setting = {
                'security': action.data,
                'loadData': false
            };
            return Object.assign({}, state, { setting: setting,})
        }

        case SettingActions.NOTIFICATION_REQUEST: {
            const setting = {
                'loadData': true
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.NOTIFICATION_RESPONSE: {
            const setting = {
                'notification': action.data,
                'loadData': false
            };
            return Object.assign({}, state, { setting: setting,})
        }

        case SettingActions.CONTACT_REQUEST: {
            const setting = {
                'loadData': true
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.CONTACT_RESPONSE: {
            const setting = {
                'contact': action.data,
                'loadData': false
            };
            return Object.assign({}, state, { setting: setting,})
        }

        case SettingActions.ADRESS_REQUEST: {
            const setting = {
                'loadData': true
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.ADRESS_RESPONSE: {
            const setting = {
                'adress': action.data,
                'loadData': false
            };
            return Object.assign({}, state, { setting: setting,})
        }

        case SettingActions.GENERAL_REQUEST: {
            const setting = {
                'loadData': true
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.GENERAL_RESPONSE: {
            const setting = {
                'status': action.data.status,
                'general': action.data,
                'loadData': false
            };
            return Object.assign({}, state, { setting: setting,})
        }

        case SettingActions.ABOUT_ME_REQUEST: {
            const setting = {
                'loadData': true
            };
            return Object.assign({}, state, {setting: setting})
        }

        case SettingActions.ABOUT_ME_RESPONSE: {
            const setting = {
                'aboutme': action.data,
                'loadData': false
            };
            return Object.assign({}, state, { setting: setting,})
        }
    }

    return state
}

export default User
