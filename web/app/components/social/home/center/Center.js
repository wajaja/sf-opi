import React            from 'react'
import createReactClass from 'create-react-class'
import { findDOMNode, unmountComponentAtNode }  from 'react-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import PostForm from './PostForm'
import NewsFeed from './NewsFeed'


const Onboarding  = createReactClass( {

    render() {

        if (!this.props.users.length) return null;

        return (
            <div className="onboarding">
                {this.props.users.map(user => (
                    <div className="user" key={`onboarding-${user.id}`}>
                        <Link to={`/profile/${user.id}`} key={user.id} className="user-info">
                            <Avatar emailHash={user.email_md5} height={50} />
                            <span>{user.first_name} <br />{user.last_name.charAt(0)}.</span>
                        </Link>
                        <div className="follow-btn">
                            <button onClick={() => this.props.onFollow(user.id)}>Follow</button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
})


/**
 * Landing
 * Landing component used by Home route
 */
const Center  = createReactClass( {

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

    postFormFocus(val) {
        this.props.postFormFocus(val)
    },

    editPostFormFocus(val) {
        this.props.editPostFormFocus(val)
    },

    getImageFromCache(filename, galleryDir){
        this.props.getImageFromCache(filename, galleryDir)
    },

    componentWillUnmount() {
        console.log('center unmounted')
    },

    /**
     *
     * @returns markup
     */
    render() {
        return (
        	<div className="wide-gutter">
                <div id="op-center-authenticated" className="op-center-authenticated">
                    <div id="_1" className="form_1">
                    	<PostForm 
                            home={this.props.home}
                            profile={this.props.profile}
                            user={this.props.user}
                            history={this.props.history}
                            auth_data={this.props.auth_data}
                            dispatch={this.props.dispatch}
                            access_token={this.props.access_token}
                            getImageFromCache={this.props.getImageFromCache}
                            timelineId={this.props.user.id}
                            form_focus={this.props.form_focus}
                            edit_form_focus={this.props.edit_form_focus}
                            newsRefs={this.props.newsRefs}
                            postFormFocus={this.postFormFocus}
                            getImageFromCache={this.getImageFromCache}
                            />
                    </div>
                    <div id="_5" className="news_5" ref={this.props.registerChild}>
                    	<NewsFeed 
                            registerChild={this.props.registerChild}
                            fetchPosts={this.props.fetchPosts}
                            user={this.props.user}
                            width={this.props.width}
                            height={this.props.height}
                            scrollTop={this.props.scrollTop}
                            isScrolling={this.props.isScrolling} 
                            onChildScroll={this.props.onChildScroll} 
                            access_token={this.props.access_token}
                            dispatch={this.props.dispatch}
                            home={this.props.home}
                            profile={this.props.profile}
                            editPostFormFocus={this.editPostFormFocus}
                            edit_form_focus={this.props.edit_form_focus}
                            form_focus={this.props.form_focus}
                            history={this.props.history}
                            location={this.props.location}
                            newsRefs={this.props.newsRefs}
                            onShare={this.onShare}
                            onComment={this.onComment}
                            onLike={this.onLike}
                            referIn={this.props.referIn}
                            screenWidth={this.props.screenWidth}
                            timelineType={this.props.timelineType}
                            onSideComment={this.onSideComment}
                            editPostFormFocus={this.editPostFormFocus}
                            serverSide={this.props.serverSide}
                            />
                    </div>
                </div>
            </div>
        )
    }
})
export default Center;