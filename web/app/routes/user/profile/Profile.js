import React                from 'react'
import { findDOMNode }      from 'react-dom'
import createReactClass     from 'create-react-class'
import { connect }          from 'react-redux'
import { fromJS, Map }      from 'immutable'
import { bindActionCreators } from 'redux'
import { Helmet }           from "react-helmet";

import { Link, withRouter,
         Switch, Route }    from 'react-router-dom'
import { push } from 'react-router-redux';

import { LiveActivities, 
         Diary, TVChannel,
}                           from '../../../components'
import { 
    ModalVideoConfirm, 
    Center,
    Right, 
}                           from '../../../components/social/home'

import Left                 from './Left'
import {
    Foot, IntroPrev, PhotosPrev, StickyMenu,
    StickyNavLinks, Head, RelationShipPrev, 
}                           from './components'
import { 
    Posts as PostsActions,
    Profiles as ProfilesActions 
}                           from '../../../actions'
import { getUrlParameterByName } from '../../../utils/funcs'

import MyLoadable    from '../../../components/MyLoadable'
const PhotosMenu    = MyLoadable({loader: () => import('./components/Photos/PhotosMenu')}),
PhotosCenter        = MyLoadable({loader: () => import('./components/Photos/PhotosCenter')}),
PhotosLeft          = MyLoadable({loader: () => import('./components/Photos/PhotosLeft')}),
AboutCenter         = MyLoadable({loader: () => import('./components/about/AboutCenter')}),
AboutLeft           = MyLoadable({loader: () => import('./components/about/AboutLeft')}),
RelationShipLeft    = MyLoadable({loader: () => import('./components/_relation/RelationShipLeft')}),
RelationShipCenter  = MyLoadable({loader: () => import('./components/_relation/RelationShipCenter')})


import '../../../styles/user/profile.scss'

/**
 * handleRouteChange
 * @param dispatch
 * @param history
 * @param location
 */
function handleSearchChange(dispatch, history, location, profileUser, user) {
    const pathname = location.pathname,
    userId  = user.id,
    username = profileUser.username,
    tag = getUrlParameterByName('tag', location.search) //['infos, photos, relations']

   //call function (Action) like => SettingActions.contact();
    if(tag === 'infos')
        dispatch(ProfilesActions.loadInfos(username))
    else if (tag === 'photos')
        dispatch(ProfilesActions.loadPhotos(username, 1))
    else if(tag === 'relationship')
        dispatch(ProfilesActions.loadRelationship(username, 1))
    else if(tag === 'timeline') 
        dispatch(ProfilesActions.loadTimeline(username, 1))
    else 
        dispatch(ProfilesActions.loadProfile(username))
}

const Profile  = createReactClass( {

    getInitialState() {
        return {
            hasOwnDiary: false,
            screenWidth: 760,
            profile: {},
            loading: true,
            profileUser: {},
            newsRefsUser:  [],
            photosUser: [],
            noPostsResults: false,
        }
    },

    onShare(postId, refer) {
        this.props.onShare(postId, refer)
    },

    onComment(comment, post) {
        this.props.onComment(comment, post)
    },

    onSideComment(comment, side, post) {
        this.props.onSideComment(comment, side, post)
    },

    onLike(data, post) {
        this.props.onLike(data, post)
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

    createMessageTo(usernames) {
        this.props.createMessageTo(usernames);
    },

    postFormFocus(val) {
        this.props.postFormFocus(val)
    },

    editPostFormFocus(val) {
        this.props.editPostFormFocus(val)
    },

    /**
     * handleScroll
     * @param e event
     */
    handleScroll(e) {

        if (this.$scroll) window.clearRequestTimeout(this.$scroll);

        this.$scroll = window.requestTimeout(() => {

            const d = findDOMNode(this._pageElm)
            const threshold = (d.offsetHeight / 2)

            if ((d.scrollTop + d.offsetHeight) >= (d.scrollHeight - threshold)) {
                this.props.onFetch()
            }

        }, 25)
    },

    updateProfile(props) {

        let profile = {}, profileUser, newsRefsUser, photosUser,
        { match : { params : { username } }, 
          profiles, dispatch, user, location, tag } = props;

        profile = profiles[username];
        console.log('la au moins')
        if(profile && profile.user && profile.user.username === username) {
            this.setState({
                loading: false,
                profileUser: profile.user,
                newsRefsUser:  profile.newsRefs,
                photosUser: profile.photos
            })
        } else {
            this.setState({
                loading: true,
                profileUser: {},
                newsRefsUser: [],
                photosUser: []
            })
        }
    },

    componentWillMount() {
        this.updateProfile(this.props);
    },

    /**
     * componentDidMount
     */
    componentDidMount() {;
        const { lastStreamId, dispatch } = this.props;
        const { profileUser } = this.state;
        import('../../../utils/OpinionStream').then(OpinionStream => {
            this.stream = new OpinionStream(dispatch, profileUser.id, lastStreamId);
        });
        import('../../../utils/StreamAnalytic').then(StreamAnalytic => {            
            //this._streamAnalytic = new StreamAnalytic(this.props.user); //TODO 
        });
    },

    _fetchPostsStream() {
        if (this._opinionStream.loading)
            return;

        if(this._opinionStream._noResults) {
            this.setState({noPostsResults: true})
            return;
        }

        this._opinionStream.loadProfile();
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        window.clearRequestTimeout(this.$scroll);
        findDOMNode(this._pageElm).removeEventListener('scroll', this.handleScroll)
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.profiles !== nextProps.profiles) {
            this.updateProfile(nextProps);
            console.log('profile nextProps')
        }

        if(this.props.location !== nextProps.location) {
            const { match : { params : { username }, location }} = this.props

            handleSearchChange(
                this.props.dispatch,
                nextProps.history,
                nextProps.location,
                this.props.profiles[username].user,
                this.props.user
            )
            this.updateProfile(nextProps);
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.user     !== nextProps.user ||
            this.props.tag      !== nextProps.tag ||
            this.props.profiles !== nextProps.profiles ||
            this.state.loading  !== nextState.loading ||
            this.state.noPostsResults !== nextState.noPostsResults)
    },

    render() {
        let profile = {},
        { 
            profileUser, 
            newsRefsUser, photosUser 
        }                           = this.state,
        { match : { params : { username } }, 
          profiles, dispatch, user, location, tag } = this.props;

        profile = profiles[username];

        if(this.state.loading) {
            return(
                <div className="hm-container profile" ref={c => this._pageElm = c}>
                    <div className="ld-route-dta">loading</div>
                </div>
            )
        }


        /////////////////
        return (
            <div className="hm-container profile" ref={c => this._pageElm = c}>
                <Helmet>
                    <title>{profileUser.firstname}</title>
                </Helmet>
                <div id="hm_lft_dv" className="hm-lft-dv">
                    {tag === null && 
                        <div className="show-usr-plus">
                            <div id="show-usr-plus-a" className="show-usr-plus-a">
                                <div className="show-usr-plus-intro">
                                    <IntroPrev
                                        {...this.props} 
                                        profile={profileUser}
                                        user={user}
                                        />
                                </div>
                                <div id="show_usr_plus_pho" className="show-usr-plus-pho">
                                    <PhotosPrev
                                        {...this.props} 
                                        user={user}
                                        profile={profileUser}
                                        photos={photosUser}
                                        />
                                </div>
                                <div id="show_usr_plus_ff" className="show-usr-plus-ff">
                                    <RelationShipPrev
                                        {...this.props} 
                                        user={user}
                                        profile={profileUser}
                                        />
                                </div>                                  
                            </div>
                        </div>
                    }
                    {tag === 'photos' && 
                        <PhotosLeft 
                            {...this.props}
                            user={user}
                            photos={profile.photos}
                            videoList={profile.videoList}
                            mostLiked={profile.mostLiked}
                            recentPhotos={profile.recentPhotos}
                            profile={profileUser}
                            />
                    }                    
                    {tag === 'infos' && 
                        <AboutLeft 
                            {...this.props}
                            user={user}
                            about={profile.about}
                            profile={profileUser}
                            />
                    }
                    {tag === 'relationship' && 
                        <RelationShipLeft 
                            {...this.props}
                            user={user}
                            friends={profile.friends}
                            profile={profileUser}
                            />
                    }
                    <div id="hm_frst_blk" className="hm-frst-blk">
                        <div className="hm-lft-dv">
                            <Left 
                                {...this.props}
                                user={user}
                                profile={profileUser}
                                />                                
                        </div>
                    </div>
                </div>
                <div  className="cover_ctnr_0">
                    <Head 
                        {...this.props} 
                        profile={profileUser}
                        user={user}
                        createMessageTo={this.createMessageTo}
                        />
                </div>
                <div id="hm_main_blk" className="col-sm-12 col-md-12 col-lg-10 col-xs-12">
                    <div className="hm-main-blk-ctnr"> 
                        <div id="home-center-div" className="home-center-div central-border col-xs-8 col-sm-8 col-md-6 col-lg-6">
                            {tag === null && 
                                <Center 
                                    {...this.props} 
                                    onShare={this.onShare} 
                                    onComment={this.onComment}
                                    onLike={this.onLike}
                                    home={false}
                                    profile={profileUser}
                                    newsRefs={newsRefsUser}
                                    fetchPosts={this._fetchPostsStream}
                                    onSideComment={this.onSideComment}
                                    postFormFocus={this.postFormFocus}
                                    editPostFormFocus={this.editPostFormFocus}
                                    referIn="profile"
                                    timelineId={profileUser.id}
                                    timeType='user'
                                    />
                            }
                            {tag === 'photos' && 
                                <PhotosCenter 
                                    {...this.props}
                                    user={user}
                                    photos={profile.photos}
                                    profile={profileUser}
                                    />
                            }

                            {tag === 'infos' && 
                                <AboutCenter 
                                    {...this.props}
                                    user={user}
                                    about={profile.about}
                                    profile={profileUser}
                                    />
                            }
                            {tag === 'relationship' && 
                                <RelationShipCenter 
                                    {...this.props}
                                    user={user}
                                    friends={profile.friends}
                                    profile={profileUser}
                                    />
                            }
                        </div>
                        <div id="hm_rght_div" className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                            <div className="lft-dv">
                                <div className="lft-dv-a">
                                    <StickyNavLinks
                                        {...this.props}
                                        dispatch={dispatch}
                                        profile={profileUser}
                                        user={user}
                                        />        
                                </div>
                                <Foot 
                                    {...this.props} 
                                    />
                            </div>
                        </div>
                    </div>
                </div>
                <ModalVideoConfirm />
            </div>
        )
    }
})
///////
const mapStateToProps = (state, {location}) => {
    const tag = getUrlParameterByName('tag', location.search) //['infos, photos, relations']
    console.log('this is an tag', tag)
    return {
        tag: tag,
        user: state.User.user,
        profiles: state.Profiles.users
    }
}

/////
function mapDispatchToProps(dispatch) {
    return {
        profileActions: bindActionCreators(ProfilesActions, dispatch),
    }
}

//////
export default  withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile))

// <Right 
//     {...this.props} 
//     screenWidth={screenWidth}
//     onFriendConfirm={this.onFriendConfirm}
//     onFriendRequest={this.onFriendRequest}
//     onFollowRequest={this.onFollowRequest}
//     onUnFollowRequest={this.onUnFollowRequest}
//     onDeleteInvitation={this.onDeleteInvitation}
//     />