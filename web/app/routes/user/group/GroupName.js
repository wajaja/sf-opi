import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { fromJS, Map }  	from 'immutable'

import { Link, withRouter } from 'react-router-dom'
import { push } from 'react-router-redux';

import { Diary, }           from '../../../components'
import { 
    ModalVideoConfirm, 
    Center,
    Right, 
}                           from '../../../components/social/home'
import Left 				from './Left'
import { IntroPrev }        from './components'

import MyLoadable    from '../../../components/MyLoadable'
const Foot    = MyLoadable({loader: () => import('./components/Foot')}),
PhotosPrev    = MyLoadable({loader: () => import('./components/PhotosPrev')}),
StickyMenu    = MyLoadable({loader: () => import('./components/StickyMenu')}),
StickyNavLinks= MyLoadable({loader: () => import('./components/StickyNavLinks')}),
OptionsPrev   = MyLoadable({loader: () => import('./components/OptionsPrev')}),
MembersPrev   = MyLoadable({loader: () => import('./components/MembersPrev')})
import { 
	Posts as PostsActions,
	Groups as GroupsActions 
}    						from '../../../actions/post'

import { getUrlParameterByName } from '../../../utils/funcs'

import '../../../styles/user/group.scss'


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


const Head = (props) => {
    const { members } = props,

    imageStyle = {
        display: 'inline-block',
    }
    return(
        <div className="grp-top-a" >
            <div className="grp-top-lft">
                <div className="grp-top-content">
                    {members.map(function(u, i) {

                        return(
                            <div key={i} className="pic-dv-grp-list">
                                <img 
                                    src={u.profile_pic.web_path}
                                    style={imageStyle}
                                    className="pic-grp-list" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const GroupName  = createReactClass( {

	getInitialState() {
		return {
			hasOwnDiary: false,
            screenWidth: 760,
            group: {},
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

    postFormFocus(val) {
        this.props.postFormFocus(val)
    },

    editPostFormFocus(val) {
        this.props.editPostFormFocus(val)
    },

    onDeleteInvitation(userId, targetId) {
        this.props.onDeleteInvitation(userId, targetId)
    },

    createMessageTo(usernames) {
    	this.props.createMessageTo(usernames);
    },


    /**
     * handleLike
     * @param data
     */
    // handleLike = (data) {
    //     this.props.dispatch(PhotosActions[data.liked ? 'like' : 'unlike'](data.id))
    // }

    /**
     * handleFetch
     */
    // handleFetch () {
    //     this.props.dispatch(PhotosActions.paginate())
    // }

    // handleLoadHidden () {
    //     this.props.dispatch(PhotosActions.loadHidden())
    // }

    // handleFollow = userID => {
    //     this.props.dispatch(ProfileActions.follow(userID)).then(followed => {
    //         this.props.dispatch(PhotosActions.reload())
    //     })

    // }

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

    updateGroup(props) {
        const { match : { params : { id } }, groups } = props,
        group = groups[id];

        if(!!group) {
            this.setState({
                group: groups[id].group,
                newsRefs: groups[id].newsRefs,
                photos: groups[id].photos,
            })
        } else {
            // this.setState({ loading: true })
        }
    },

    componentWillMount() {
        this.updateGroup(this.props);
    },

    /**
     * componentDidMount
     */
    componentDidMount() {
        this.setState({
            screenWidth:  window.screen.width
        })
        const { lastStreamId, dispatch } = this.props;
        const { group } = this.state;

        import('../../../utils/OpinionStream').then(OpinionStream => {
            this.stream = new OpinionStream(dispatch, group.id, lastStreamId);
        });
        import('../../../utils/StreamAnalytic').then(StreamAnalytic => {            
            //this._streamAnalytic = new StreamAnalytic(this.props.user); //TODO 
        });
        // dispatch(PostsActions.load(user.id, postIds));   //redux saga
    },

    _fetchPostsStream() {
        if (this._opinionStream.loading)
            return;

        if(this._opinionStream._noResults) {
            this.setState({noPostsResults: true})
            return;
        }

        this._opinionStream.loadGroup();
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        window.clearRequestTimeout(this.$scroll);
        findDOMNode(this._pageElm).removeEventListener('scroll', this.handleScroll)
    },

    componentWillReceiveProps(nextProps) {
    	if(this.props.groups !== nextProps.groups) {
    		this.updateGroup(nextProps);
    	}

    	if(this.props.location !== nextProps.location) {
    		handleSearchChange(
    			this.props.dispatch,
    			nextProps.history,
    			nextProps.location
    		)
    	}
    },

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.loading !== nextProps.props ||
            this.state.group !== nextState.group ||
            this.state.noPostsResults !== nextState.noPostsResults)
    },

	render() {
		const { 
            hasOwnDiary, screenWidth, 
            group, newsRefs, 
            photos, 
        }                         = this.state,
		{ dispatch, user, loading  }        = this.props

        if(loading) {
            return(
                <div className="hm-container group" ref={c => this._pageElm = c}>
                    <div className="ld-route-dta">loading</div>
                </div>
            )
        }

        /////////////////
		return (
			<div className="hm-container group" ref={c => this._pageElm = c}>
                <div id="hm_main_blk" className="col-sm-12 col-md-12 col-lg-10 col-xs-12">
                    <div className="hm-main-blk-ctnr"> 
                    	<div className="grp-lft-dv">
                            <div className="grp-frst-blk">
                                <div className="grp-frst-blk-a">
                                    <Left 
                                        {...this.props}
                                        user={user}
                                        group={group}
                                        photos={photos}
                                        renderNavLinks={false}
                                        screenWidth={screenWidth}
                                        />                                
                                </div>
                            </div>
                    	</div>
                        <div id="home-center-div" className="home-center-div central-border col-xs-8 col-sm-8 col-md-6 col-lg-6">
                            <div  className="center-tp">
                                <Head 
                                    {...this.props} 
                                    group={group}
                                    members={group.members}
                                    user={user}
                                    />
                            </div>
                            <div  className="center-bd">
                                <Center 
                                    {...this.props} 
                                    onShare={this.onShare} 
                                    onComment={this.onComment}
                                    onLike={this.onLike}
                                    home={false}
                                    group={group}
                                    newsRefs={newsRefs}
                                    fetchPosts={this._fetchPostsStream}
                                    onSideComment={this.onSideComment}
                                    screenWidth={screenWidth}
                                    group={group}
                                    referIn="group"
                                    timelineId={group.id}
                                    timeType='group'
                                    postFormFocus={this.postFormFocus}
                                    editPostFormFocus={this.editPostFormFocus}
                                    />
                            </div>
                        </div>
                        <div id="hm_rght_div" className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                            <div className="lft-dv">
                                <div className="lft-dv-a">
                                    <StickyNavLinks
                                    	{...this.props}
                                        dispatch={dispatch}
                                        group={group}
                                        user={user}
                                        />        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalVideoConfirm />
            </div>
		)
	}
})


//////
export default  withRouter(connect(state =>({
	user: state.User.user,
	groups: state.Groups.groups,
    loading: state.Groups.loading
}))(GroupName))