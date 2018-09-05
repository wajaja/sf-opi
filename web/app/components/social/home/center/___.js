import React                    from 'react'
import createReactClass         from 'create-react-class'
import { findDOMNode, unmountComponentAtNode }          from 'react-dom'
import { connect }              from 'react-redux'
import { Link }                 from 'react-router-dom'
import _                        from 'lodash'

import { Post, ModalShare }     from '../../../post'
import bindFunctions            from '../../../../utils/bindFunctions'
import { 
    Posts as PostsActions, 
    Shares as SharesActions
}                               from '../../../../actions/post'
import { 
    App as AppActions 
}                               from '../../../../actions/social'

/**
 * Landing
 * Landing component used by Home route
 */
const NewsFeed  = createReactClass( {

    getInitialState() {
        return {
            sharing: false,
            newsFeed: [],
        }
    },

    getDefaultProps() {
        return {
            selectedText: '',
        }
    },

    handleRefresh() {
        console.log('refreshing the content')
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
        console.log(postId, refer)
        this.props.onShare(postId, refer)
        // this.setState({sharing: true})
    },

    editPostFormFocus(val) {
        this.props.editPostFormFocus(val)
    },

    updatePostList(news, refs) {
        const lookup = _.keyBy(refs, (r) => r.id + r.type ),
        list = _.filter(news, function(n) {
            if((lookup[n.id + n.type]) !== undefined) {
                return n
            }
        }),
        newsFeed = _.uniqBy(list, n => [n.id, n.type].join()) //make unique post in list

        this.setState({
            newsFeed: newsFeed.reverse() //restore order from newsFeed store
        })
    },

    /**
     * handleScroll
     * @param e event
     */
    handleScroll(e) {
        // console.log('scrolling');

        // if (this.$scroll) clearTimeout(this.$scroll)

        // this.$scroll = setTimeout(() => {

        //     const d = findDOMNode(this._pageElm)
        //     const threshold = (d.offsetHeight / 2)

        //     if ((d.scrollTop + d.offsetHeight) >= (d.scrollHeight - threshold)) {
        //         this.props.onFetch()
        //     }

        // }, 25)
    },

    componentWillMount() {
        // this.props.dispatch(PostsActions.load());
        const { news, newsRefs } = this.props
        this.updatePostList(news, newsRefs)
    },

    /**
     * componentDidMount
     */
    componentDidMount() {
        const { news, newsRefs } = this.props
        this.updatePostList(news, newsRefs)
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.props != prevProps) {
            
        }
    },

    componentWillReceiveProps(nextProps) {
        const { news, newsRefs } = nextProps

        if(this.props.newsRefs !== nextProps.newsRefs) {
            this.updatePostList(news, nextProps.newsRefs)
        }
    },

    componentWillUnmount() {
        // let mountNode = findDOMNode(this),
        // unmount = unmountComponentAtNode(mountNode);
        // console.log(unmount)
    },

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.newsFeed !== nextState.newsFeed ||
                this.state.sharing !== nextState.nextState)
    },

    /**
     * handleRefresh
     * @param e event
     */
    // handleRefresh = (e) {
    //     this.props.onLoadHidden()
    // },

     /**
     *
     * @returns markup
     */
    renderListOrMessage () {

        if (!this.props.photos.length) return

        return (
            <div>
                <PhotoList onLike={this.props.onLike} photos={this.props.photos.filter(p => !p.hidden)}/>
                {this.props.photos.filter(p => p.hidden).length
                    ? (<button className="load-posts" onClick={this.handleRefresh}>
                        Load New Posts
                    </button>
                ) : null}
            </div>
        )

    },

    /**
     *
     * @returns markup
     */
    render() {
        const self         = this,
        { selectedText }   = this.props,  
        { newsFeed }       = this.state
        return (
            <div onScroll={this.handleScroll}>
                <div className="news-div-a">
                    <div className="nws-div-b" id="_nws_dv_b">
                        {newsFeed.map(function(post, i) {
                            return (
                                <div key={post.type + "-" + post.id} className="pst-c new-pst appended">
                                    <Post 
                                        {...self.props}
                                        post={post} 
                                        postId={post.id}
                                        postType={post.type}
                                        onLike={self.onLike}
                                        onShare={self.onShare}
                                        onComment={self.onComment}
                                        selectedText={selectedText}
                                        onSideComment={self.onSideComment}
                                        editPostFormFocus={self.editPostFormFocus}
                                        />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
})

export default connect(state => ({
    postsById: state.Posts.postsById,
    postIds: state.Posts.postIds,
    news: state.NewsFeed.news,
}))(NewsFeed);