import React                        from 'react'
import createReactClass             from 'create-react-class'
import { Link, Route, 
    Redirect, withRouter, Switch
 }                                  from 'react-router-dom'
import { connect }                  from 'react-redux'
import classnames                   from 'classnames'
import * as axios                   from 'axios'
import _                            from 'lodash'

import { getUrlParameterByName }    from '../../../utils'
import { BASE_PATH }                from '../../../config/api'
import * as DraftFuncs              from '../../../components/social/home/form/DraftFuncs'


import { ProfilePic, 
         Infos, Relations
                      }             from './panels'

import { 
    Questions as QuestionsActions,
    Responses as ResponsesActions,
    Authors as AuthorsActions,
    Photos as PhotosActions,
    Photo as PhotoActions,
    App as AppActions
}                                   from '../../../actions'

import '../../../styles/user/confirmed.scss'


/**
 * handleRouteChange
 * @param dispatch
 * @param history
 * @param location
 */
function handleRouteChange(dispatch, history, location) {
    const pathname = location.pathname;

    pathnameArr = pathname.split('/');

    if(pathname.indexOf('/profilepic')) {
        console.log('ProfilePic')
    } else if(pathname.indexOf('/relations')) {
        console.log('relations')
    } else if(pathname.indexOf('/infos')) {
        console.log('infos')
    } else {
        
    }
}


const Confirmed  = createReactClass( {

    getInitialState() {
        const location = this.props.location ? this.props.location 
                                             : this.props.history.location
        return {
            left: '100px',
            width: '800px',
            height: '400px',
            // panel: getUrlParameterByName('panel', location.search),
        }
    },

    onFriendRequest(userId, targetId) {
        this.props.onFriendRequest(userId, targetId);
    },

    onFollowRequest(userId, targetId) {
        this.props.onFollowRequest(userId, targetId);
    },

    onFriendConfirm(userId, targetId) {
        this.props.onFriendConfirm(userId, targetId);
    },

    onUnFollowRequest(userId, targetId) {
        this.props.onUnFollowRequest(userId, targetId)
    },

    onDeleteInvitation(userId, targetId) {
        this.props.onDeleteInvitation(userId, targetId)
    },

    componentDidMount() {
        //next images in this post
        //perform ajax request for getting next photo id on this one
        const { dispatch, params, history } = this.props;
        
    },

    componentDidUpdate(oldProps, oldState) {
        if(this.props !== oldProps) {
            // this.setState({
            //     panel: getUrlParameterByName('panel', this.props.history.location.search)  
            // })
        }
    },

    componentWillUpdate(nextProps, nextState) {
           
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.location !== nextProps.location) {
            handleRouteChange(
                this.props.dispatch,
                nextProps.history,
                nextProps.location
            )
        }
    },

    render() {
        const { left, width, halfHeight }   = this.state,
                { user, match } = this.props;

        // if(!panel || (['profilepic', 'relations', 'infos'].indexOf(panel) === -1)) {
        //     //redirect to profile
        //     return  <Redirect to={{
        //                 pathname: '/confirmed/',
        //                 search: '?panel=profilepic',
        //                 state: { referrer: this.props.location }
        //             }}/>
        // }

        return (
            <div className="cfmd-ctnr">
                <Switch>
                    <Route exact path='/confirmed/profilepic' children={() => <ProfilePic {...this.props} />} />
                    <Route exact path='/confirmed/infos' children={() => <Infos {...this.props} />} />
                    <Route exact path='/confirmed/relations' 
                        children={() => 
                            <Relations 
                                onFollowRequest={this.onFollowRequest}
                                onFriendConfirm={this.onFriendConfirm}
                                onFriendRequest={this.onFriendRequest}
                                onDeleteInvitation={this.onDeleteInvitation}
                                onUnFollowRequest={this.onUnFollowRequest}
                                {...this.props} 
                            />
                        } 
                    />
                    <Redirect to='/confirmed/profilepic' />
                </Switch>
            </div>
        )
    }
})

/////
export default withRouter(connect(state => ({ 
    user: state.User.user,
}))(Confirmed))
