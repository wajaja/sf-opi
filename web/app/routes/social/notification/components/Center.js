import React            from 'react'
import createReactClass from 'create-react-class'
import { findDOMNode }  from 'react-dom'
import { connect }      from 'react-redux'
import { 
    Link, NavLink 
}                       from 'react-router-dom'
import { Sticky }       from 'react-sticky'
import { NewsFeed }     from '../../../../components'

//////////
export const UserSorting  = (props) => {
    const { q, match, tag } = props

    return (
        <div className="usr-srt">
            <div className="stk-mnu-ctnr">
                <div className="stk-mnu-h-ctnr">
                    <div className="stk-mnu-h-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=${tag}&sort=all`} 
                            className="mnu-chd-lk"
                            activeStyle={{
                                    background: '#f0f6f7',
                                    border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="mnu-ico-ctnr"></span>
                            <span className="mnu-txt-ctnr">all</span>
                        </NavLink>
                    </div>
                </div>
                <div className="stk-mnu-info-ctnr">
                    <div className="stk-mnu-info-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=${tag}&sort=username`} 
                            className="mnu-chd-lk"
                            activeStyle={{
                                background: '#f0f6f7',
                                border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="mnu-ico-ctnr"></span>
                            <span className="mnu-txt-ctnr">username</span>
                        </NavLink>
                    </div>
                </div>
                <div className="stk-mnu-photos-ctnr">
                    <div className="stk-mnu-photos-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=${tag}&sort=email`} 
                            className="mnu-chd-lk"
                            activeStyle={{
                                background: '#f0f6f7',
                                border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="mnu-ico-ctnr"></span>
                            <span className="mnu-txt-ctnr">email</span>
                        </NavLink>
                    </div>
                </div>
                <div className="stk-mnu-frds-ctnr">
                    <div className="stk-mnu-frds-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=${tag}&sort=name`} 
                            className="mnu-chd-lk"
                            activeStyle={{
                                background: '#f0f6f7',
                                border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="mnu-ico-ctnr"></span>
                            <span className="mnu-txt-ctnr">name</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

/////
export const PostSorting  = (props) => {
    const { q, match, tag } = props
        
    return (
        <div className="post-srt">
            <div className="stk-mnu-ctnr">
                <div className="stk-mnu-h-ctnr">
                    <div className="stk-mnu-h-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=${tag}&sort=all`} 
                            className="mnu-chd-lk"
                            activeStyle={{
                                    background: '#f0f6f7',
                                    border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="mnu-ico-ctnr"></span>
                            <span className="mnu-txt-ctnr">all</span>
                        </NavLink>
                    </div>
                </div>
                <div className="stk-mnu-info-ctnr">
                    <div className="stk-mnu-info-ctnr-a">
                        <NavLink 
                            to={`${match.url}?q=${q}&tag=${tag}&sort=user`} 
                            className="mnu-chd-lk"
                            activeStyle={{
                                background: '#f0f6f7',
                                border: '1px solid #cfe0e3'
                            }}
                            >
                            <span className="mnu-ico-ctnr"></span>
                            <span className="mnu-txt-ctnr">created by user</span>
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
                        return (
                            <div className="stk-mnu-dv" style={{...style, marginTop: top }}>
                                <div className="stk-mnu-dv-a">
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
        const { q, tag, } = this.props
        return (
        	<div className="wide-gutter">
                <div id="op-center-authenticated" className="op-center-authenticated">
                    <div id="_1" className="form_1">
                    	<StickySorting
                            {...this.props}
                            q={q}
                            tag={tag}

                            />
                    </div>
                    <div id="_5" className="news_5">
                        <div className="notif-pg-list-ctnr">
                        	{notifications.map(function(n, i) {
                                return(
                                    <div key={i}  className="nt-pg-box">
                                        <div className="nt-pg-box-ctnr">
                                            <NotifContentBox
                                                data={n} 
                                                /> 
                                        </div>
                                        <div className='notif-load-gif'></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})
export default connect(state => ({
    // newsRefs: state.Search.newsRefs
}))(Center);