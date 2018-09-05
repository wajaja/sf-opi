import React            from 'react'
import createReactClass from 'create-react-class'
import { findDOMNode }  from 'react-dom'
import { connect }      from 'react-redux'
import { 
    Link, NavLink 
}                       from 'react-router-dom'
import { Sticky }       from 'react-sticky'
import { NewsFeed }     from '../../../../components'
import GroupBox         from '../../../../routes/user/group/components/GroupBox'
import PlaceBox         from '../../../../routes/social/place/components/PlaceBox'

const Groups = (props) => {

    const { 
        groups,
    }                      = props,

    imageStyle = {
        height: '98px',
        width: '98px',
        border: '1px solid #595656',
        borderRadius: '50%'
    }

    if(!!groups && typeof groups === 'array') {
        return(
            <div className="stk-tri-ctnr">
                <div className="stk-tri-ctnr">
                    {groups.map((group, i) => {
                        return (
                            <GroupBox
                                key={i}
                                user={user}
                                group={group}
                                dispatch={dispatch}
                                />
                        )
                    })}
                    {!users.length &&
                        <div className="stk-tri-ctnr empty-result" >
                            No Result
                        </div>
                    }
                </div>
            </div>
        )
    }

    return (
        <div className="stk-tri-ctnr">
            <div className="stk-tri-ctnr">
                <div className="stk-tri-ctnr empty-result" >
                    No Result
                </div>
            </div>
        </div>
    )
}

const Places = (props) => {

    const { 
        places,
    }                      = props,

    imageStyle = {
        height: '98px',
        width: '98px',
        border: '1px solid #595656',
        borderRadius: '50%'
    }

    if(!!places && typeof places === 'array') {
        return(
            <div className="stk-tri-ctnr">
                <div className="stk-tri-ctnr">
                    {places.map((place, i) => {
                        return (
                            <PlaceBox
                                key={i}
                                user={user}
                                place={place}
                                dispatch={dispatch}
                                />
                        )
                    })}
                    {!users.length &&
                        <div className="stk-tri-ctnr empty-result" >
                            No Result
                        </div>
                    }
                </div>
            </div>
        )
    }

    return (
        <div className="stk-tri-ctnr">
            <div className="stk-tri-ctnr">
                <div className="stk-tri-ctnr empty-result" >
                    No Result
                </div>
            </div>
        </div>
    )
}

const Users = (props) => {

    const { 
        users, onFriendRequest, 
        onFollowRequest, dispatch,
        onFriendConfirm, onDeleteInvitation,
        onUnFollowRequest
    }                      = props,

    imageStyle = {
        height: '98px',
        width: '98px',
        border: '1px solid #595656',
        borderRadius: '50%'
    }

    if(!!users && typeof users === 'array') {
        return(
            <div className="stk-tri-ctnr">
                <div className="stk-tri-ctnr">

                    {users.map((sugg, i) => {
                        return (
                            <SuggestUserBox
                                key={i}
                                user={user}
                                type="search-detail"
                                full={true}
                                suggestion={sugg}
                                dispatch={dispatch}
                                imageStyle={imageStyle}
                                onFriendRequest={onFriendRequest}
                                onFriendConfirm={onFriendConfirm}
                                onFollowRequest={onFollowRequest}
                                onDeleteInvitation={onDeleteInvitation}
                                onUnFollowRequest={onUnFollowRequest}
                                />
                        )
                    })}
                    {!users.length &&
                        <div className="stk-tri-ctnr empty-result" >
                            No Result
                        </div>
                    }
                </div>
            </div>
        )
    }

    return (
        <div className="stk-tri-ctnr">
            <div className="stk-tri-ctnr">
                <div className="stk-tri-ctnr empty-result" >
                    No Result
                </div>
            </div>
        </div>
    )
}

//////////
const UserSorting  = (props) => {
    const { q, match, tag } = props

    return (
        <div className="usr-srt">
            <div className="stk-tri-ctnr">
                <div className="stk-tri-ctnr">
                    <div className="stk-tri-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=users&sort=all`} 
                            className="tri-chd-lk"
                            activeStyle={{
                                    background: '#f0f6f7',
                                    border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="tri-ico-ctnr"></span>
                            <span className="tri-txt-ctnr">all</span>
                        </NavLink>
                    </div>
                </div>
                <div className="stk-tri-ctnr">
                    <div className="stk-tri-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=users&sort=username`} 
                            className="tri-chd-lk"
                            activeStyle={{
                                background: '#f0f6f7',
                                border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="tri-ico-ctnr"></span>
                            <span className="tri-txt-ctnr">username</span>
                        </NavLink>
                    </div>
                </div>
                <div className="stk-tri-ctnr">
                    <div className="stk-tri-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=users&sort=email`} 
                            className="tri-chd-lk"
                            activeStyle={{
                                background: '#f0f6f7',
                                border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="tri-ico-ctnr"></span>
                            <span className="tri-txt-ctnr">email</span>
                        </NavLink>
                    </div>
                </div>
                <div className="stk-tri-ctnr">
                    <div className="stk-tri-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=users&sort=name`} 
                            className="tri-chd-lk"
                            activeStyle={{
                                background: '#f0f6f7',
                                border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="tri-ico-ctnr"></span>
                            <span className="tri-txt-ctnr">name</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

//////////
const GroupSorting  = (props) => {
    const { q, match, tag } = props

    return (
        <div className="usr-srt">
            <div className="stk-tri-ctnr">
                <div className="stk-tri-ctnr">
                    <div className="stk-tri-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=groups&sort=all`} 
                            className="tri-chd-lk"
                            activeStyle={{
                                    background: '#f0f6f7',
                                    border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="tri-ico-ctnr"></span>
                            <span className="tri-txt-ctnr">all</span>
                        </NavLink>
                    </div>
                </div>
                <div className="stk-tri-ctnr">
                    <div className="stk-tri-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=groups&sort=name`} 
                            className="tri-chd-lk"
                            activeStyle={{
                                background: '#f0f6f7',
                                border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="tri-ico-ctnr"></span>
                            <span className="tri-txt-ctnr">Group Name</span>
                        </NavLink>
                    </div>
                </div>
                <div className="stk-tri-ctnr">
                    <div className="stk-tri-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=groups&sort=local`} 
                            className="tri-chd-lk"
                            activeStyle={{
                                background: '#f0f6f7',
                                border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="tri-ico-ctnr"></span>
                            <span className="tri-txt-ctnr">local</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PlaceSorting  = (props) => {
    const { q, match, tag } = props

    return (
        <div className="usr-srt">
            <div className="stk-tri-ctnr">
                <div className="stk-tri-ctnr">
                    <div className="stk-tri-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=places&sort=all`} 
                            className="tri-chd-lk"
                            activeStyle={{
                                    background: '#f0f6f7',
                                    border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="tri-ico-ctnr"></span>
                            <span className="tri-txt-ctnr">all</span>
                        </NavLink>
                    </div>
                </div>
                <div className="stk-tri-ctnr">
                    <div className="stk-tri-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=places&sort=local`} 
                            className="tri-chd-lk"
                            activeStyle={{
                                background: '#f0f6f7',
                                border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="tri-ico-ctnr"></span>
                            <span className="tri-txt-ctnr">local</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PostSorting  = (props) => {
    const { q, match, tag } = props
        
    return (
        <div className="post-srt">
            <div className="stk-tri-ctnr">
                <div className="stk-tri-ctnr">
                    <div className="stk-tri-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=posts&sort=all`} 
                            className="tri-chd-lk"
                            activeStyle={{
                                    background: '#f0f6f7',
                                    border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="tri-ico-ctnr"></span>
                            <span className="tri-txt-ctnr">all</span>
                        </NavLink>
                    </div>
                </div>
                <div className="stk-tri-ctnr">
                    <div className="stk-tri-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=posts&sort=user`} 
                            className="tri-chd-lk"
                            activeStyle={{
                                background: '#f0f6f7',
                                border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="tri-ico-ctnr"></span>
                            <span className="tri-txt-ctnr">created by user</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

/////////
const StickySorting = createReactClass({

    getInitialState() {
        return{

        }
    },

    render() {
        const { match, location, q, tag } = this.props

        return (
            <Sticky topOffset={62}>
                {({
                    style,

                    // the following are also available but unused in this example 
                    isSticky,
                    wasSticky,
                    distanceFromTop,
                    distanceFromBottom,
                    calculatedHeight
                    }) => {
                        const top = isSticky ? 62 : 0
                        if(!q) {
                            return(
                                <div className="stk-tri-dv" style={{...style, marginTop: top }}>
                                    <div className="stk-tri-dv-a" 
                                        style={{
                                            fontSize: '22px',
                                            textTransform: 'capitalize',
                                            color: '#bbb',
                                            padding: '40px',
                                        }}>
                                        No Query
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <div className="stk-tri-dv" style={{...style, marginTop: top }}>
                                <div className="stk-tri-dv-a">
                                    {tag === "users" && 
                                        <UserSorting 
                                            q={q}
                                            tag={tag}
                                            match={match}
                                            />
                                    }
                                    {tag === "posts" && 
                                        <PostSorting 
                                            q={q}
                                            tag={tag}
                                            match={match}
                                            />
                                    }
                                    {tag === "groups" && 
                                        <GroupSorting 
                                            q={q}
                                            tag={tag}
                                            match={match}
                                            />
                                    }
                                    {tag === "places" && 
                                        <PlaceSorting 
                                            q={q}
                                            tag={tag}
                                            match={match}
                                            />
                                    }
                                </div>
                            </div>
                        )
                    }
                }
            </Sticky>
        )
    }
})

/**
 * Landing
 * Landing component used by Home route
 */
const Center  = createReactClass({

    getDefaultProps () {
        return { 
            onFetch: () => {},
        }
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

    onShare(postId, refer) {
        this.props.onShare(postId, refer)
    },

    render() {
        const { q, tag, posts, users, match, groups, places } = this.props
        return (
        	<div className="wide-gutter">
                <div id="op-center-authenticated" className="op-center-authenticated">
                    <div id="_1" className="form_1">
                    	<StickySorting
                            {...this.props}
                            />
                    </div>
                    <div id="_5" className="news_5">
                        {tag === "users" && 
                            <Users 
                                {...this.props}
                                users={users}
                                q={q}
                                tag={tag}
                                />
                        }
                        {tag === "posts" && 
                        	<NewsFeed 
                                {...this.props} 
                                selectedText={q}
                                match={match}
                                home={this.props.home}
                                profile={this.props.user}
                                newsRefs={this.props.newsRefs}
                                onShare={this.onShare}
                                onComment={this.onComment}
                                onLike={this.onLike}
                                onSideComment={this.onSideComment}
                                />
                        }
                        {tag === "groups" && 
                            <Groups 
                                {...this.props}
                                groups={groups}
                                q={q}
                                tag={tag}
                                />
                        }
                    </div>
                </div>
            </div>
        )
    }
})
export default connect(state => ({
    search: state.Search,
}))(Center);