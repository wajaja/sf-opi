import React                from 'react'
import createReactClass     from 'create-react-class'
import { findDOMNode }      from 'react-dom'
import { connect }          from 'react-redux'
import { bindActionCreators } from 'redux'
import { Helmet }           from 'react-helmet'
import { 
    Link, withRouter 
}                           from 'react-router-dom'

import { SuggestUsers, NotifContentBox 
}                                   from '../../../components'
import { 
    Left, Center, Right 
}                                   from './components'
import { 
    Posts as PostsActions,
    Notification as NotificationActions 
}                                   from '../../../actions'
import Foot                         from './components/Foot'
import { getUrlParameterByName }    from '../../../utils/funcs'

//import Actor from 'components/Activity/Actor'
import '../../../styles/social/notification.scss'

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

const Notification  = createReactClass({

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

        if (this.$scroll) window.clearRequestTimeout(this.$scroll)

        this.$scroll = window.requestTimeout(() => {

            const d = findDOMNode(this._pageElm)
            const threshold = (d.offsetHeight / 2)

            if ((d.scrollTop + d.offsetHeight) >= (d.scrollHeight - threshold)) {
                this.props.onFetch()
            }

        }, 25)
    },

    handleNotifClick(note) { 
        console.log('full note page click', note)
    },

    componentWillMount() {
        // this.screenWidth =  window.screen.width
        //far make more operations for newsRefs
        this.setState({
            newsRefs: this.props.newsRefs,
        })
    },

    /**
     * componentDidMount
     */
    componentDidMount() {
        this.setState({
            screenWidth:  window.screen.width
        })
        const { user, postIds, dispatch } = this.props;
        findDOMNode(this._pageElm).addEventListener('scroll', this.handleScroll)

        // dispatch(PostsActions.load(user.id, postIds));   //redux saga
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        findDOMNode(this._pageElm).removeEventListener('scroll', this.handleScroll)
        window.clearRequestTimeout(this.$scroll)
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.user !== nextProps.user) {
            const { dispatch, user, postIds } = nextProps
            // dispatch(PostsActions.load(user.id, postIds));   //redux saga
        }
    },

    shouldComponentUpdate(nextProps) {
        return this.props.notifications !== nextProps.notifications;
    }, 

    handleRefresh(e) {
        this.props.onLoadHidden()
    },

    /**
     * render
     * @returns {*|markup}
     */
    render() {

        const { dispatch, user, notifications }      = this.props,
        { hasOwnDiary, screenWidth, newsRefs }  = this.state,
        userId                        = user.id,
        q = getUrlParameterByName('q', location.search)
        return (
            <div className="hm-container notification" ref={c => this._pageElm = c}>
                <Helmet>
                    <title>Create Place</title>
                </Helmet>
                <div className="hm-main-blk">
                    <div className="hm-main-blk-ctnr">
                        <div id="hm_lft_dv" className="hm-lft-dv">
                            <div id="hm_frst_blk" className="hm-frst-blk">
                                <div className="hm-frst-blk-a">
                                    <Left 
                                        user={this.props.user}
                                        history={this.props.history}
                                        auth_data={this.props.auth_data}
                                        dispatch={this.props.dispatch}
                                        access_token={this.props.access_token}
                                        getImageFromCache={this.props.getImageFromCache}
                                        changeView={this.props.changeView}
                                        clientId={this.props.clientId}
                                        peerCon={this.props.peerCon}
                                        startCall={this.props.startCall}
                                        callWindow={this.props.callWindow}
                                        localSrc={this.props.localSrc}
                                        peerSrc={this.props.peerSrc}
                                        callConfig={this.props.callConfig}
                                        mediaDevice={this.props.peerCon.mediaDevice}
                                        endCall={this.props.endCall}
                                        fireUser={this.props.fireUser}
                                        firebase={this.props.firebase}
                                        toggleOnlineList={this.props.toggleOnlineList}
                                        />                                
                                </div>
                            </div>
                        </div>
                        <div id="home-center-div" 
                            style={{
                                left: 0,
                                right: 0,
                                marginRight: "auto",
                                marginLeft: "auto",
                                position: "absolute",
                                float: "none",
                                marginTop: "12px", 
                                background: "#fff",
                                padding: "10px",
                                borderRadius: "2px"
                            }}
                            className="home-center-div central-border">
                            <div className="hm-frst-blk">
                                <div className="hm-frst-blk-a">
                                    {notifications.map((n, i) => {
                                        if(!n.id) return (<div key={i}></div>)

                                        return(
                                            <div key={i}  className="nt-pg-box">
                                                <div className="nt-pg-box-ctnr">
                                                    <NotifContentBox
                                                        data={n} 
                                                        history={this.props.history}
                                                        location={this.props.location}
                                                        handleNotifClick={this.handleNotifClick}
                                                        /> 
                                                </div>
                                                <div className='notif-load-gif'></div>
                                            </div>
                                        )
                                    })}
                                    {!notifications.length && 
                                        <div  className="nt-pg-box">
                                            <div className="nt-pg-box-ctnr">
                                                You don't have notifications
                                            </div>
                                        </div>}
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
        notificationActions: bindActionCreators(NotificationActions, dispatch),
    }
}

/**
 * connect
 * Connects React component to a Redux store
 * Documentation: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
 */
export default  withRouter(connect(state => ({
    user:   state.User.user,
    notifications: state.Notification.notifications
    // tokens: state.Tokens,
    // photos: state.Photos,
    // onboarding: state.Onboarding,
}), mapDispatchToProps)(Notification))
