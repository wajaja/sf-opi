import React                    from 'react'
import createReactClass         from 'create-react-class'
import { findDOMNode, unmountComponentAtNode }  from 'react-dom'
import { connect }              from 'react-redux'
import { Link }                 from 'react-router-dom'
import _                        from 'lodash'
import PropTypes                from 'prop-types';
import { CellMeasurer, 
    CellMeasurerCache, List, 
    InfiniteLoader, AutoSizer, WindowScroller
}                               from 'react-virtualized';
import { Post, LoadingIndicator, 
    PostHolder, NoPostResult 
}                               from '../../../../components'
import bindFunctions            from '../../../../utils/bindFunctions'
import { 
    Posts as PostsActions, 
    Shares as SharesActions,
    App as AppActions 
}                               from '../../../../actions'

/**
 * Landing
 * Landing component used by Home route
 */
const NewsFeed  = createReactClass({

    getInitialState() {

        this._cache = new CellMeasurerCache({
            fixedWidth: true,
            minHeight: 330,
        });
        this._mostRecentWidth = 0;
        this._resizeAllFlag = false;

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
        console.log('new comment in newsFeed');
        //update virtualized list
        const index = this.props.newsRefs.length;
        this._cache.clear(index, 0);
        if (this._list) {
            this._list.recomputeRowHeights(index);
        }
    },

    recomputePostHeight(index){
        console.log('recomputingHeight', index);
        this._cache.clear(index, 0);
        if (this._list) {
            this._list.recomputeRowHeights(index);
        }
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

        //update virtualized list
        const index = this.state.newsFeed.length;
        this._cache.clear(index, 0);
        if (this._list) {
            console.log(this._list, 'exist')
            this._list.recomputeRowHeights(index);
        }
        // this._cache.clearAll();
        // if (this._list) {
        //     this._list.recomputeRowHeights();
        // }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this._resizeAllFlag ||
            this.props.disableMedia !== prevProps.disableMedia
            ) {
            this._resizeAllFlag = false;
            this._cache.clearAll();
            if (this._list) {
                console.log(this._list, 'exist')
                this._list.recomputeRowHeights();
            }

        //recompute the first item in feed if new post have been added to newsFeed
        //delete all cache
        } else if (this.props.newsRefs && this.props.newsRefs[0] && 
                (this.props.newsRefs[0].id !== prevProps.newsRefs[0].id)) {
            const index = prevState.newsFeed.length;
            this._cache.clearAll();
            if (this._list) {
                console.log(this._list, 'exist')
                this._list.recomputeRowHeights();
            }

        //load more news manner
        } else if (this.state.newsFeed !== prevState.newsFeed) {
            const index = prevState.newsFeed.length;
            this._cache.clear(index, 0);
            if (this._list) {
                console.log(this._list, 'exist')
                this._list.recomputeRowHeights(index);
                // this._list.recomputeRowHeights();
                // this.forceUpdate();
            }
        } else if(this.props.comments !== prevProps.comments) {
            // const index = prevState.newsFeed.length;
            // this._cache.clear(index, 0);
            // if (this._list) {
            //     this._list.recomputeRowHeights(index);
            // }
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
                this.state.sharing !== nextState.sharing || 
                this.props.serverSide !== nextProps.serverSide)
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
     * scrollTop<Number> Forced vertical scroll offset; can be used to synchronize scrolling between components
     * @returns markup
     */
    render() {
        //registerChild used from WindowScroller in startup/Root Component
        const { newsFeed } = this.state,
        { fetchPosts, serverSide }    = this.props; 

        console.log('serverSide', serverSide);
        // if(serverSide) {
        //     return (
        //         <div className="news-div-a">
        //             <div className="news-div-b place-holder">
        //                 {newsFeed.map((post, i) => (
        //                     <div key={i} className="pst-c new-pst appended">
        //                         <div className="pst-d">
                                    
        //                         </div>
        //                     </div>
        //                 ))}
        //             </div>
        //         </div>
        //     )
        // } 


        return (
            <InfiniteLoader
                isRowLoaded={this._isRowLoaded}
                loadMoreRows={fetchPosts}
                rowCount={newsFeed.length + 1}
                threshold={1}>
                {({ onRowsRendered, registerChild }) => {
                    this._onRowsRendered = onRowsRendered;
                    return(
                        <WindowScroller
                            serverHeight={2600}
                            >
                                {({height, scrollTop /*,isScrolling, registerChild, onChildScroll,*/ }) => (
                                    <AutoSizer 
                                        disableHeight
                                        onResize={this._onResize}>
                                        {({width /*, height*/}) => {
                                            console.log('second he', height);
                                            if (this._mostRecentWidth && this._mostRecentWidth !== width) {
                                                this._resizeAllFlag = true;

                                                setTimeout(this._resizeAll, 0);
                                            }

                                            this._mostRecentWidth = width;
                                            this._registerList = registerChild;
                                            console.log(width);

                                            return (
                                                <div 
                                                    className={!!serverSide ? `news-div-a place-holder` : `news-div-a`}>
                                                    <List
                                                        autoHeight
                                                        width={width}
                                                        height={height}
                                                        className={this.props.edit_form_focus ? `nws-div-b active` : `nws-div-b`}
                                                        ref={this._setListRef}
                                                        overscanRowCount={10}
                                                        scrollTop={scrollTop}
                                                        deferredMeasurementCache={this._cache}
                                                        rowCount={newsFeed.length /*+ 1*/}
                                                        rowHeight={this._cache.rowHeight}
                                                        rowRenderer={this._rowRenderer}
                                                        noRowsRenderer={this._noRowsRenderer}
                                                      />
                                                </div>
                                            )
                                        }}
                                    </AutoSizer>
                                )}
                        </WindowScroller>
                    )
                }}
            </InfiniteLoader>
        )
    },

    ////////////////////////////////{post.type + "-" + post.id}
    _rowRenderer({index, key, parent, style}) {

        const newsFeed = this.state.newsFeed,
        { list,  selectedText, serverSide } = this.props;

        let content;

        if (index >= newsFeed.length) {
            content = <PostHolder />;
        } else if(serverSide) {
            const post = newsFeed[index];
            content = <PostHolder post={post} style={style} />
        }
        else {
            const post = newsFeed[index];
            content = (
                <Post 
                    style={style}
                    {...this.props}
                    post={post} 
                    postId={post.id}
                    index={index}           //usefull for recomputingHeight from childreen
                    feedRef={this._list}    //usefull for recomputingHeight from childreen
                    postType={post.type}
                    onLike={this.onLike}
                    authenticated={true}
                    onShare={this.onShare}
                    onComment={this.onComment}
                    selectedText={selectedText}
                    onSideComment={this.onSideComment}
                    editPostFormFocus={this.editPostFormFocus}
                    recomputePostHeight={this.recomputePostHeight}
                    />
            );
        }

        //width={this._mostRecentWidth} on CellMeasurer
        return (
            <CellMeasurer
                cache={this._cache}
                columnIndex={0}
                key={key}
                rowIndex={index}
                parent={parent}>
                    {content}
            </CellMeasurer>
        );
    },

    _noRowsRenderer() {

        return (
            <NoPostResult location={this.props.location} />
        );
    },

    _onResize({ width }) {
        // const { columnCount } = this.state;
       
        // this.setState({
        //     // Subtracting 30 from `width` to accommodate the padding from the Bootstrap container
        //     columnWidth: (width - 30) / columnCount
        // });
         
        // this._cache.clearAll();
        // this._grid.recomputeGridSize();
        console.log('resize Page');
    },

    _resizeAll(){
        this._resizeAllFlag = false;
        this._cache.clearAll();
        if (this._list) {
            this._list.recomputeRowHeights();
        }
    },

    _setListRef(ref) {
        this._list = ref;
        this._registerList(ref);
    },

    _isRowLoaded({ index }) {
        return index < this.state.newsFeed.length;
    }
})


// static propTypes = {
//     authenticated: PropTypes.bool.isRequired,
//     disableMedia: PropTypes.bool.isRequired,
//     fetchTweets: PropTypes.func.isRequired,
//     tweet: PropTypes.object.isRequired
// };

export default connect(state => ({
    postsById: state.Posts.postsById,
    postIds: state.Posts.postIds,
    news: state.NewsFeed.news,
    comments: state.Comments.comments
}))(NewsFeed);