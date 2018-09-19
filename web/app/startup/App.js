import React, { 
    cloneElement 
}                               from 'react'
import createReactClass         from 'create-react-class'
import PropTypes                from 'prop-types'
import { connect }              from 'react-redux'
import { 
    Route, withRouter,
}                               from 'react-router-dom'
import {toastr}                 from 'react-redux-toastr'
import localforage              from 'localforage' 
import { StickyContainer }      from 'react-sticky';
import _                        from 'lodash'
import { bindActionCreators }   from 'redux'

import {
    App as AppActions,
    Auth as AuthAction,
    Photos as PhotosActions,
    Shares as SharesActions,
    Invitation as InvitationsActions,
    VideoUploader as VideoUploaderActions
}                               from './../actions'

import setAuthorizationToken    from './../utils/set-authorization-token'
import { handleRouteChange }    from './../utils/funcs'
import PeerConnection           from './../utils/chat/PeerConnection'
import { possibleLocale, }      from './setApp'

import { 
    Header, DefaultNavBar, 
    NavBar, WelcomeNavBar, WelcomeFoot
}                               from './../components'

import MyLoadable    from './../components/MyLoadable'

import { prodConfig, devConfig } from './../firebase/firebase'

import './../styles/social/social-layout.scss'
import './../styles/social/opinion-animate.scss'
import './../styles/social/rc-menu.scss';

const ModalVideo = MyLoadable({loader: () => import('./../routes/media/videos/ModalVideo')}),
ModalPicture     = MyLoadable({loader: () => import('./../routes/media/pictures/ModalPicture')}),
FlashMessage     = MyLoadable({loader: () => import('./../components/social/commons/FlashMessage')}),
Exception        = MyLoadable({loader: () => import('./../components/social/Exception')}),
ModalShare       = MyLoadable({loader: () => import('./../components/post/share/ModalShare')}),
NewMessageModal  = MyLoadable({loader: () => import('./../components/message/NewMessageModal')}),
ModalTagFriend   = MyLoadable({loader: () => import('./../components/media/ModalTagFriend')}),
CallModal        = MyLoadable({loader: () => import('./../components/message/CallModal')}),
CallWindow       = MyLoadable({loader: () => import('./../components/message/chat/calls/CallWindow')})
// import 'video-js.css'

// if(typeof window === 'undefined') {
//     global.window = {};
// }

// //initial value of XMLHttpRequest for SSR
// if (typeof XMLHttpRequest === 'undefined') {
//     global.XMLHttpRequest = {};
// }

// if(typeof document === 'undefined') {
//     global.document = {};
// }

const Home              = require('./../routes/social/Home/Home').default
//get environement mode

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React)
}

/**
 * AppHeader component
 */
const AppHeader = createReactClass({

    /**
     * render
     * @returns markup
     */
    render() {

        const { header, user, router, location, access_token } = this.props
        
        if (location.pathname == '/' && !access_token) {
            return (
              <WelcomeNavBar {...this.props} />
            )
        }

        ///return default navbar if not authenticated
        if (!access_token) {
            return (
              <DefaultNavBar {...this.props} />
            )
        }

        ///return normal header when user authenticated 
        return (
            <NavBar
                user={user}
                router={router}
                userID={user.id} 
                match={this.props.match}
                logout={this.props.logout}
                history={this.props.history}
                location={this.props.location}
                auth_data={this.props.auth_data}
                dispatch={this.props.dispatch}
                access_token={this.props.access_token}
                navInvitsBox={this.props.navInvitsBox}
                navMessageBox={this.props.navMessageBox}
                navNotifsBox={this.props.navNotifsBox}
                navParamsBox={this.props.navParamsBox}
                getImageFromCache={this.props.getImageFromCache}
                toggleNavParams={this.props.toggleNavParams}
                toggleNavNotifs={this.props.toggleNavNotifs}
                toggleNavInvits={this.props.toggleNavInvits}
                toggleNavMessage={this.props.toggleNavMessage}
                />
        )
    }
})


//////
/**
 * App component
 * Bootstraps application
 */
const App = createReactClass ({

    getInitialState() {
        this.previousLocation = this.props.location;

        return {
            flashMessageType: '',
            createMessage: false,
            createMessageRecipients: [],
            showModalImageCache: false,
            screenWidth: 760,
            srcImageCache: '',
            idImageCache: '',
            form_focus: false,
            edit_form_focus: false,
            loadImageCache: false,
            navParamsBox: false,
            navNotifsBox: false,
            navMessageBox: false,
            navInvitsBox: false,
            fireUser: null,
            // calling: false,
            userMediaType: '',
            callingModal: false, 

            //call's state keys
            clientId: '',
            callWindow: '',
            callModal: '',
            callFrom: '',
            localSrc: null,
            peerSrc: null
        }
    },

    //call keys
    peerCon: {},
    firebase: null,
    callConfig: null,
    database: null,

    readCallMessage(data) {
        const msg = JSON.parse(data.val().message),
        type = data.val().type;

        if(type === 'init') {
            this.setState({ clientId: data.id })
        } else if(type === 'request') {
            this.setState({ callModal: 'active', callFrom: data.from })
        } else if(type === 'call') {
            if (data.sdp) {
                this.peerCon.setRemoteDescription(data.sdp);
                if (data.sdp.type === 'offer') this.peerCon.createAnswer();
            } else this.peerCon.addIceCandidate(data.candidate);
        } else if(type === 'end')
            this.endCall.bind(this, false)

        // else if(type === 'init')
        //     .emit('init');
    },

    //calling_process 1
    startCall(isCaller, friendID, config) {
        this.callConfig = config;
        this.peerCon = new PeerConnection(this.firebase, friendID, this.props.user.id)
        //on event extended from Emitter
        .on('localStream', (src) => {
            const newState = { callWindow: 'active', localSrc: src };
            //if not a caller; don't show modal
            if (!isCaller) newState.callModal = '';
                this.setState(newState);
        })

        //on event extended from Emitter
        .on('peerStream', src => this.setState({ peerSrc: src }))

        //config = {audio: true, video: ...}
        .start(isCaller, config);
    },

    rejectCall() {
        socket.emit('end', { to: this.state.callFrom });
        this.setState({ callModal: '' });
    },

    endCall(isStarter) {
        if (_.isFunction(this.peerCon.stop)) this.peerSrc.stop(isStarter);
        this.peerSrc = {};
        this.callConfig = null;
        this.setState({
            callWindow: '',
            localSrc: null,
            peerSrc: null
        });
    },

    // We can pass a location to <Switch/> that will tell it to
    // ignore the router's current location and use the location
    // prop instead.
    //
    // We can also use "location state" to tell the app the user
    // wants to go to `/img/2` in a modal, rather than as the
    // main page, keeping the gallery visible behind it.
    //
    // Normally, `/img/2` wouldn't match the gallery at `/`.
    // So, to get both screens to render, we can save the old
    // location and pass it to Switch, so it will think the location
    // is still `/` even though its `/img/2`.

    onComment(comment, post) {
        //do sommething with this
        console.log(comment)
    },

    onSideComment(comment, side, post) {
        console.log(comment, side)
    },

    onLike(data, post) {
        console.log(data, post)
    },

    onShare(postId, refer) {
        const { dispatch } = this.props;
        dispatch(AppActions.modalShare(true, refer))
        dispatch(SharesActions.handleShare(postId, refer))
    },

    postFormFocus(val) {
        if(this.state.form_focus === val) 
            return;
        this.setState({form_focus: val})
    },

    editPostFormFocus(val) {
        if(this.state.edit_form_focus === val)
            return;
        this.setState({edit_form_focus: val})
    },

    toggleNavParams(val){
        if(this.state.navParamsBox === val) return;
        if(val !== undefined) {
            this.setState({navParamsBox: val});
            return;
        }
        this.setState({navParamsBox: !this.state.navParamsBox})
    },

    threadCreated(thread) {
        console.log('do sommething when new thread was created')
        // this.setState({})
    },

    toggleNavMessage(val){
        if(this.state.navMessageBox === val) return;
        if(val !== undefined) {
            this.setState({navMessageBox: val});
            return;
        }
        this.setState({navMessageBox: !this.state.navMessageBox})
    },

    toggleNavInvits(val){
        if(this.state.navInvitsBox === val) return;
        if(val !== undefined) {
            this.setState({navInvitsBox: val});
            return;
        }
        this.setState({navInvitsBox: !this.state.navInvitsBox})
    },

    toggleNavNotifs(val){
        if(this.state.navNotifsBox === val) return;
        if(val !== undefined) {
            this.setState({navNotifsBox: val});
            return;
        }
        this.setState({navNotifsBox: !self.state.navNotifsBox})
    },

    getImageFromCache(filename, galleryDir) {
        this.setState({
            loadImageCache: true,
            showModalImageCache: true,
        })
        this.props.dispatch(PhotosActions.getImageFromCache(filename, galleryDir))
        .then((data) => {
            const { src, image } = data
            if(src)
                this.setState({
                    srcImageCache: src,
                    idImageCache: image.id,
                    loadImageCache: false
                });
        }, (err) => {
            console.log('err :', err);
                self.setState({loadImageCache: false })
        })
    },

    closeModalImageCache() {
        this.setState({showModalImageCache: false})
    },

    closeModalShare() {
        const { dispatch } = this.props;
        dispatch(AppActions.modalShare(false, 'post'))
    },

    sendShare(data, postId, refer) {
        const { dispatch } = this.props;
        dispatch(SharesActions.createShare(data, postId, refer))
        this.setState({flashMessageType: 'share'})
    },

    // const pathname = this.props.history.location.pathname
    // pathArr = pathname.split('/')
    // if(pathArr.length === 1) {
    //     const name = pathArr[0] === 
    // }
    onFriendRequest(userId, targetId) {
        this.props.dispatch(InvitationsActions.requestFriend(userId, targetId))
        .then((status) => {
            console.log('relationShip')
        });
    },

    onFollowRequest(userId, targetId) {
        this.props.dispatch(InvitationsActions.follow(userId, targetId))
        .then((status) => {
            console.log('relationShip')
        });
    },

    onFriendConfirm(userId, targetId) {
        this.props.dispatch(InvitationsActions.confim(userId, targetId))
        .then((status) => {
            console.log('relationShip')
        });
    },

    onUnFollowRequest(userId, targetId) {
        this.props.dispatch(InvitationsActions.unFollow(userId, targetId))
        .then((status) => {
            console.log('relationShip')
        });
    },

    onDeleteInvitation(userId, targetId) {
        this.props.dispatch(InvitationsActions.deleteInvitation(userId, targetId))
        .then((status) => {
            console.log('relationShip')
        });
    },

    setCanPlayType() {
        var el = document.createElement && document.createElement('video'), 
                 canPlayType = {};
        if(el.canPlayType) {
            canPlayType['mpeg'] = "" !== el.canPlayType('video/mp4; codecs="mp4v.20.8"')

            canPlayType['h264'] = "" !== el.canPlayType('video/mp4; codecs="avc1.42E01E"')
                                           || el.canPlayType('video/mp4; codecs="mp4a.40.2"')

            canPlayType['ogg']  = "" !== el.canPlayType('video/ogg; codecs="theora"')

            canPlayType['webm'] = "" !== el.canPlayType('video/webm; codecs="vp8, vp9, vorbis"')
            this.props.dispatch(VideoUploaderActions.setCanPlayType(canPlayType));
        }
    },

    getFriendsIds(lists) { 
        return lists.map(u => u.id) 
    },

    // handleClick (e) {
    //     console.log('document click')
    //     // if(ReactDOM.findDOMNode(this).contains(e.target)) {
    //     // } else {
    //     //     dispatch(AppActions.tabnav(false))
    //     //     this.setState({active : this.context.store.getState().App.tabnav});
    //     // }
    //     // var component = ReactDOM.findDOMNode(this.refs.tabnav);
    // }

    createMessageTo(usernames) {
        this.setState({
            createMessage : true,
            createMessageRecipients: usernames
        })
    },

    cancelNewMessage() {
        this.setState({
            createMessage: false,
            createMessageRecipients: ''
        })
    },

    componentWillMount () {
        const { dispatch, getState, defaults, user, access_token } = this.props;
        setAuthorizationToken(access_token);
    },

    /**
    * Function that takes firebase idToken then send it to server
    */
    sendTokenToServer(token) {
        this.props.sendTokenToServer(token)
    },

    // onScroll({ scrollTop, scrollLeft }){
    //     console.log('scrollTop', scrollTop)
    // },

    // onResize({ height, width}) {
    //     console.log('height', height)
    // },

    // componentWillUnmount () {
    //     window.document.removeEventListener('click', this.handleClick, false);
    // },

    /**
     * componentDidMount
     */
    componentDidMount() {
        if(this.props.user && this.props.access_token) {
            console.log(this.props.user, 'et', this.props.access_token)
            this.subscribeToServices();   
        }
        ////https://web.facebook.com/videocall/incall/?peer_id=100006750760505&call_id=3164762795&is_caller=true&audio_only=false&nonce=f1d5a04124f80f4

        ////call's event listener
        //detect video forrmat can be played in browser
        this.setCanPlayType();
        if (typeof window !== 'undefined' && !window.Intl) {
            import('intl').then(data => {});
            import(`intl/locale-data/jsonp/${possibleLocale}.js`).then(module => {});
        }
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.user !== nextProps.user) {
            const { dispatch, getState, defaults, user } = this.props;                   //redux-saga
            // dispatch(UsersActions.loadDefault(user.id, this.getFriendsIds(defaults)));  //redux saga 
        }
    },


    componentWillUpdate(nextProps, nextState) {
        if(nextProps.flashMessage != this.props.flashMessage) {
            //animate opacity after prepreding data to news div container 
            // const containers = window.document.getElementsByClassName("formPshare");
            // for (var i = 0; i < containers.length; i++) {
            //     if(!$(containers[i]).hasClass('in')) {
            //         window.getComputedStyle(containers[i]).display;
            //         containers[i].className += ' in';
            //     }
            // }
        }

        const { location } = this.props;
        // set previousLocation if props.location is not modal
        if (nextProps.history.action !== "POP" && 
            (!location.state || !location.state.modal)) {
            this.previousLocation = this.props.location;
        }
    },



    /**
     * componentDidUpdate
     * @param oldProps
     * @returns {*}
     */
    componentDidUpdate(prevProps) {
        const dispatch = this.props.dispatch;
        // handleRouteChange(
        //     this.props.dispatch,
        //     this.props.routes[this.props.routes.length - 1],
        //     this.props.location
        // )

        // if (prevProps.user.id != this.props.user.id && !this.props.user.id) {
        //     return browserHistory.push('/login')
        // }

        // if (prevProps.user.id != this.props.user.id && this.props.user.id) {
        //     //this.connectToStream()
        //     dispatch(AppActions.init())
        // }

        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0)
        }

        if(prevProps.flashMessage != this.props.flashMessage && this.props.flashMessage) {
            //add some flash message after sharing publication
            window.requestTimeout(() =>{dispatch(AppActions.flashMessage(false))}, 6000);
        }
    },

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            
        }

        if(this.props.location.pathname !== nextProps.location.pathname) {
            handleRouteChange(
                this.props.dispatch,
                nextProps.history,
                nextProps.location
            )
        }
    },
    

    // connectToStream = () => {
    //     // follow 'timeline_flat' feed
    //     this.timeline = this.client.feed('timeline_flat', this.props.user.id, this.props.tokens.timelineFlat)
    //     this.timeline
    //         .subscribe(data => {
    //             this.props.dispatch(StreamActions.timeline(data))
    //         })
    //         .then(() => {
    //             //console.log('Full (Timeline Flat): Connected to faye channel, waiting for realtime updates');
    //         }, (err) => {
    //             console.error('Full (Timeline Flat): Could not estabilsh faye connection', err);
    //         });

    //     // follow 'notifications' feed
    //     this.notification = this.client.feed('notification', this.props.user.id, this.props.tokens.notification)
    //     this.notification
    //         .subscribe(data => {
    //             this.props.dispatch(StreamActions.event(data))
    //         })
    //         .then(() => {
    //             //console.log('Full (Notifications): Connected to faye channel, waiting for realtime updates');
    //         }, (err) => {
    //             console.error('Full (Notifications): Could not estabilsh faye connection', err);
    //         });
    // }
    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.flashMessage !== nextState.flashMessage ||
            this.state.showModalImageCache !== nextState.showModalImageCache ||
            this.state.screenWidth !== nextState.screenWidth ||
            this.state.form_focus !== nextState.form_focus ||
            this.state.edit_form_focus !== nextState.edit_form_focus ||
            this.state.createMessage !== nextState.createMessage ||
            this.props.exception !== nextProps.exception ||
            this.props.modalShare !== nextProps.modalShare ||
            this.props.flashMessage !== nextProps.flashMessage || 
            this.props.location !== nextProps.location);
    },

    /**
     * render
     * @returns markup
     */
    render() {
        const { location, } = this.props,
        picRoute = ~location.pathname.indexOf('/pictures/') ? true : false,
        vidRoute = ~location.pathname.indexOf('/videos/') ? true : false,
        //see https://reacttraining.com/react-router/web/example/modal-gallery for more detail
        // isModalVideo = !!(vidRoute && location.state && location.state.modal && (this.previousLocation !== location)),
        isModalPhoto = !!(picRoute && location.state && location.state.modal && (this.previousLocation !== location)); // not initial render

        console.log('picRoute', picRoute)
        console.log('location.state.modal', location)
        console.log('this.previousLocation', this.previousLocation)
        const childrenWithProps = React.Children.map(this.props.children, 
            (child) => React.cloneElement(child, {
                onLike: this.onLike,
                onShare: this.onShare,
                sendShare: this.sendShare,
                onComment: this.onComment,
                customLocation: isModalPhoto ? this.previousLocation : location,
                form_focus: this.state.form_focus,
                firebase: this.firebase,
                fireUser: this.state.fireUser,
                edit_form_focus: this.state.edit_form_focus,
                onSideComment: this.onSideComment,
                postFormFocus: this.postFormFocus,
                editPostFormFocus: this.editPostFormFocus,
                screenWidth: this.state.screenWidth,
                createMessageTo: this.createMessageTo,
                cancelNewMessage: this.cancelNewMessage,
                getImageFromCache: this.getImageFromCache,
                threadCreated: this.threadCreated,
                database: this.database,

                //relative to rtc call
                clientId: this.state.clientId,
                startCall: this.startCall,
                rejectCall: this.rejectCall,
                callWindow: this.state.callWindow,
                localSrc: this.state.localSrc,
                peerSrc: this.state.peerSrc,
                callConfig: this.callConfig,
                peerCon: this.peerCon,
                endCall: this.endCall,

                closeModalShare: this.closeModalShare,
                onDeleteInvitation: this.onDeleteInvitation,
                onFriendConfirm: this.onFriendConfirm,
                onFriendRequest: this.onFriendRequest,
                onFollowRequest: this.onFollowRequest,
                onUnFollowRequest: this.onUnFollowRequest,
                userID: this.props.user ? this.props.user.id : null,
                ...this.props,
        }));

        //TODO connect modal to the app component
        //suppressHydrationWarning={true} due to server side rendering
        return (
            <div id="root">
                <AppHeader 
                    {...this.props} 
                    {...this.state}
                    toggleNavParams={this.toggleNavParams}
                    toggleNavNotifs={this.toggleNavNotifs}
                    toggleNavInvits={this.toggleNavInvits}
                    toggleNavMessage={this.toggleNavMessage}
                    />
                <div className="bdy-children">
                    <StickyContainer>
                        <div className="bdy-children-a">
                            {childrenWithProps}
                            {this.props.exception.status && 
                                <Exception 
                                    exception={this.props.exception}
                                    persistor={this.props.persistor}
                                    store={this.props.store}
                                    />}
                            {this.props.modalShare && 
                                <ModalShare 
                                    refer={this.props.modalShareRefer}
                                    sharedPost={this.props.sharedPost}
                                    sendShare={this.sendShare}
                                    closeModalShare={this.closeModalShare}
                                    dispatch={this.props.dispatch}
                                    />}
                            {this.state.showModalImageCache && 
                                <ModalTagFriend 
                                    closeModal={this.closeModalImageCache}
                                    isRequesting={this.state.loadImageCache}
                                    src={this.state.srcImageCache}
                                    imageId={this.state.idImageCache}
                                    />}
                            {this.props.flashMessage && 
                                <FlashMessage
                                    message={this.state.flashMessageType}
                                    dispatch={this.props.dispatch}
                                    />}
                            {this.state.createMessage && 
                                <NewMessageModal
                                    cancelNewMessage={this.cancelNewMessage}
                                    recipients={this.state.createMessageRecipients}
                                    />}
                            <CallModal
                                dispatch={this.props.dispatch}
                                status={this.state.callModal}
                                startCall={this.startCall}
                                rejectCall={this.rejectCall}
                                callFrom={this.state.callFrom}
                                />
                            <div className={this.state.form_focus ? `gl-frm-out out-active` : `gl-frm-out`}></div>
                            <div className={this.state.edit_form_focus ? `edt-pst-out out-active` : `edt-pst-out`}></div>
                        </div>
                    </StickyContainer>
                </div>
                {isModalPhoto ? <Route path="/pictures/:id" children={() => <ModalPicture {...this.props} />} /> : null }
                {!this.props.access_token &&
                    <WelcomeFoot
                        dispatch={this.props.dispatch} />
                }
            </div>
        )
    },


    //////video calling
    startCalling() {
        var localMediaStream;

        if (navigator.getUserMedia) {
            navigator.getUserMedia(videoObj, function(stream) {              
                video.src = (navigator.webkitGetUserMedia) ? window.webkitURL.createObjectURL(stream) : stream;
                localMediaStream = stream;
                
            }, function(error) {
                console.error("Video capture error: ", error.code);
            });

            btnStop.addEventListener("click", function() {
                localMediaStream.stop();
            });

            btnPhoto.addEventListener("click", function() {
                context.drawImage(video, 0, 0, 320, 240);

            });
        }
    },

    subscribeToServices() {
        console.log('subscribe;;;')
        const self    = this,
        webSocket     = WS.connect("ws://127.0.0.1:8080"),
        { threadsIds, dispatch, getState, defaults, user, access_token, auth_data,  } = this.props,
        { password, email, } = auth_data,
        { username, id, } = user;
        import('firebase').then((firebase) => {
            const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
            if (!firebase.apps.length) {
                firebase.initializeApp(config);
                this.firebase = firebase;
            }
            this.database = firebase.database();

            const dbCall = firebase.database().ref(`webrtc/${this.props.user.id}`);
            dbCall.on('child_added', this.readCallMessage);

            // const { fireAuth, fireDB } = firebase

            // fireAuth.signOut();  //logout user

            // fireDB.onceGetUsers().then(snapshot =>
            //   console.log('users', snapshot.val())
            // );

            //A listener that set firebase user in redux when signIn or signOut
            firebase.auth().onAuthStateChanged(authUser => {
              authUser
                ? dispatch(AuthAction.setFireUser(authUser))
                : dispatch(AuthAction.setFireUser(null));
            });
    
            const fireUser = firebase.auth().currentUser

            
            if(fireUser) {
                firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                    // Send token to your backend via HTTPS
                    self.sendTokenToServer(idToken)
                }).catch(function(error) {
                    // Handle error
                    console.log('error when sending idToken to server', error)
                });
                // auth.doPasswordReset(email).then(
                //     () => {
                //         this.setState(() => ({ ...INITIAL_STATE }));
                //     }).catch(error => {
                //         this.setState(byPropKey('error', error));
                //     });
                // auth.doPasswordUpdate(passwordOne).then(
                //     () => {
                //         this.setState(() => ({ ...INITIAL_STATE }));
                //     }).catch(error => {
                //         this.setState(byPropKey('error', error));
                //     });
            } else {
                // Sign In for firebase
                firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
                    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                        // Send token to your backend via HTTPS
                        self.sendTokenToServer(idToken)
                    }).catch(function(error) {
                        // Handle error
                        console.log('error when sending idToken to server', error)
                    });
                }).catch(
                    error => {                        
                        if(error.code === 'auth/user-not-found') {
                            firebase.auth().createUserWithEmailAndPassword(email, password).then(
                                authUser => {
                                    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                                      // Send token to your backend via HTTPS
                                        self.sendTokenToServer(idToken)
                                    }).catch(function(error) {
                                        // Handle error
                                        console.log('error when sending idToken to server', error)
                                    });
                                    // Create a user in your own accessible Firebase Database too
                                    // authUser.uid || user.id 
                                    firebase.database().ref(`users/${id}`).set({username, email,}).then(() => {
                                        console.log('my own user accessible created')
                                    }).catch(
                                    error => {
                                        console.log('my own user accessible not created', error)
                                    });
                            }).catch(
                                error => {
                                    console.log('user not created', error)
                            });
                        } else {
                            console.log('error', error)
                        }
                    }
                );
            }
        })

        this.setState({screenWidth:  window.screen.width })


        /**
        * !!!Important !!!!!!!!!!!!!!!!
        * access_token mean a token comes from server with 
        * initial Redux state  
        */
        window.localStorage.setItem('_tk_key', access_token);

        //handle realtime incomming messages
        //for all threadsIds where user is participant
        webSocket.on("socket/connect", (session) => {
            this.session = session;
            _.each(threadsIds, (threadId, i) => {
                this.session.subscribe(`message/send/channel/${threadId}`, (uri, payload) => {
                    if(payload.data) {
                        const message = JSON.parse(payload.data).data
                        console.log(message)
                        dispatch({type: 'MESSAGE::PUBLISH_THREAD_MESSAGE', message, threadId})
                    }
                });
            })
        })

        webSocket.on("socket/disconnect", function(error){
            console.log("Disconnected for " + error.reason + " with code " + error.code);
        })
    }
})
                ////// {isModalVideo ? <Route path="/videos/" children={() => <ModalVideo {...this.props} />} /> : null}
/////
function mapDispatchToProps(dispatch) {
    return  bindActionCreators(Object.assign({}, AuthAction), dispatch)
}

///// This is our select function that will extract from the state the data slice we want to expose
// through props to our component.
const mapStateToProps = (state /*, props*/) => {
    return {
        user:           state.User.user,
        access_token:   state.Auth.token,
        auth_data:      state.Auth.data,
        threadsIds:      state.Message.threadsIds,
        loading:        state.App.loading,
        lastStreamId:   state.Stream.lastStreamId,
        isAuthenticated: state.Auth.isAuthenticated,
        tokens:         state.Tokens,
        modalShare:     state.App.modalShare,
        sharedPost:     state.Shares.sharedPost,
        modalShareRefer: state.App.modalShareRefer,
        flashMessage:   state.App.flashMessage,
        defaults:       state.Users.defaults,
        exception:      state.Exception,
    }
}

/** Access to the history object’s properties 
 *  and the closest <Route>'s match via the withRouter
 */
export default withRouter(connect(
    mapStateToProps , mapDispatchToProps /*, [mergeProps], [options]*/
)(App))