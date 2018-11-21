import React                from 'react'
import createReactClass     from 'create-react-class'
import { findDOMNode }      from 'react-dom'
import { connect }          from 'react-redux'
import { bindActionCreators } from 'redux'
import { Helmet }           from 'react-helmet'
import { 
    Link, withRouter 
}                           from 'react-router-dom'

import { NotifContentBox, 
         InvitationBox, SuggestUserBox
}                                   from '../../../components'
import { 
    Left, Center, Right 
}                                   from './components'
import { getUrlParameterByName }    from '../../../utils/funcs'
import { UserIsAuthenticated }      from '../../../utils/auth/authWrappers'
import { 
    Invitation as InvitationActions, 
}                                   from '../../../actions'
import Foot                         from './components/Foot'

//import Actor from 'components/Activity/Actor'
import '../../../styles/user/invitation.scss'

// import {
//     User as UserActions,
//     Photos as PhotosActions,
//     Profile as ProfileActions,
// } from 'actions'

/**
 * handleRouteChange
 * @param dispatch
 * @param history
 * @param location
 */
function handleSearchChange(dispatch, history, location) {
    const pathname = location.pathname,
    tag = getUrlParameterByName('tag', location.search) //['infos, photos, relations']

    if(pathname.indexOf('/grouppic')) {
        console.log('ProfilePic')
    } else if(pathname.indexOf('/relations')) {
        console.log('relations')
    } else if(pathname.indexOf('/infos')) {
        console.log('infos')
    } else {
        
    }
}

/**
 * Home
 * '/'
 * React Route - Documentation: https://github.com/reactjs/react-router/tree/master/docs
 * @UserIsAuthenticated
 */
const Invitation  = createReactClass({

    getInitialState() {
        return {
            hasOwnDiary: true,
            screenWidth: 760,
        }
    },

    /**
     * handleScroll
     * @param e event
     */
    handleScroll(e) {

        if (this.$scroll) window.clearRequestTimeout(this.$scroll);

        this.$scroll = window.requestTimeout(() => {

            const d = findDOMNode(this)
            const threshold = (d.offsetHeight / 2)

            if ((d.scrollTop + d.offsetHeight) >= (d.scrollHeight - threshold)) {
                this.props.onFetch()
            }

        }, 25)
    },

    /**
     * componentDidMount
     */
    componentDidMount() {
        this.setState({
            screenWidth:  window.screen.width
        })
        const { user, postIds, dispatch } = this.props;
        findDOMNode(this).addEventListener('scroll', this.handleScroll)
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        window.clearRequestTimeout(this.$scroll);
        findDOMNode(this).removeEventListener('scroll', this.handleScroll)
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.user !== nextProps.user) {
            const { dispatch, user, postIds } = nextProps
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.suggestions !== nextProps.suggestions ||
                this.props.invitations !== nextProps.invitations || 
                this.props.user !== nextProps.user
    },

    /**
     * handleRefresh
     * @param e event
     */
    handleRefresh(e) {
        this.props.onLoadHidden()
    },

    /**
     * render
     * @returns {*|markup}
     */
    render() {

        const { dispatch, user, invitations, suggestions }      = this.props,
        { hasOwnDiary, screenWidth, newsRefs }  = this.state,
        userId                        = user.id,
        q = getUrlParameterByName('q', location.search)
        return (
            <div className="hm-container invitation" ref={c => this._pageElm = c}>
                <Helmet>
                    <title>Invitation</title>
                </Helmet>
                <div id="hm_main_blk" className="hm-main-blk">
                    <div className="hm-main-blk-ctnr">
                        <div id="hm_lft_dv" className="hm-lft-dv">
                            <div id="hm_frst_blk" className="hm-frst-blk">
                                <div className="hm-frst-blk-a">
                                    <Left 
                                        {...this.props}
                                        q={q}
                                        screenWidth={screenWidth}
                                        />                                
                                </div>
                            </div>
                        </div>
                        <div id="home-center-div" className="home-center-div central-border">
                            <div className="hm-frst-blk">
                                <div className="hm-frst-blk-tp">
                                    <div className="hm-frst-blk-tp-a">
                                        {!!invitations && invitations.map((inv, i) => {
                                            return(
                                                <div key={i}  className="inv-pg-box">
                                                    <InvitationBox
                                                        user={user}
                                                        invitation={inv} 
                                                        dispatch={dispatch}
                                                        onFriendConfirm={this.onFriendConfirm}
                                                        onDeleteInvitation={this.onDeleteInvitation}
                                                        /> 
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="hm-frst-blk-btm">
                                    <div className="hm-frst-blk-btm-a">
                                        {suggestions.map((sugg, i) => {
                                            return (
                                                <SuggestUserBox
                                                    key={i}
                                                    user={user}
                                                    type="suggestion-detail"
                                                    full={true}
                                                    suggestion={sugg}
                                                    dispatch={dispatch}
                                                    imageStyle={{
                                                        display: 'inline-block'
                                                    }}
                                                    onFriendRequest={this.onFriendRequest}
                                                    onFriendConfirm={this.onFriendConfirm}
                                                    onFollowRequest={this.onFollowRequest}
                                                    onDeleteInvitation={this.onDeleteInvitation}
                                                    onUnFollowRequest={this.onUnFollowRequest}
                                                    />
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

////////
function mapDispatchToProps(dispatch) {
    return {
        invitationActions: bindActionCreators(InvitationActions, dispatch),
    }
}

/**
 * connect
 * Connects React component to a Redux store
 * Documentation: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
 */
export default  withRouter(connect(state => ({
    user:   state.User.user,
    invitations: state.RelationShip.invitations,
    suggestions: state.RelationShip.suggestions
}), mapDispatchToProps)(Invitation))
