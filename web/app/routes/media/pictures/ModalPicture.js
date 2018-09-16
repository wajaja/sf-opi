import React                        from 'react'
import createReactClass             from 'create-react-class'
import { withRouter, }              from 'react-router-dom'
import { connect }                  from 'react-redux'
import { canUseDOM }                from '../../../utils/executionEnvironment' 
import { ModalPhoto, }             from './components'

import { 
    Photo as PhotoActions,
    App as AppActions
}                                   from '../../../actions'

import '../../../styles/post/photo.scss'

const ModalPicture  = createReactClass( {

    /**
     * state
     * @type {{caption: string, hashtags: string, location: string, filename: string, uploadState: string, disabledUploadState: boolean}}
     */
    getInitialState() {
        return {
            comments: [],
            left: '100px',
            width: '800px',
            height: '400px',
            photoCtnr: '450px',
            halfHeight: '250px',
        }
    },

    initialized: false,

    /**
     * handleChange
     * @param e event
     */
    handleChange(e) {

        e.preventDefault()

        let reader = new FileReader(),
            file   = e.target.files[0]

        this.setState({ filename: file.name })

    },

    componentWillMount() {
        if(canUseDOM) {
            this.initialize();
        }
    },

    componentDidMount() {
        //next images in this post
        //perform ajax request for getting next photo id on this one
        if(this.initialized === false || !this.initialized) {
            this.initialize();
        }
    },

    initialize() {
        this.initialized = true
        const { dispatch, match: {params}, location: {query, pathname } } = this.props,
        loading     = false,
        postId      = params.id,
        status      = { modal: true, returnTo: pathname },
        winWidth    = window.innerWidth,
        winHeight   = window.innerHeight;

        let _width       = (winWidth - (60 * 2)),
        _height      = (winHeight - (30 * 2));

        if(_width > 1100)
            _width   = 1100;

        if(_height > 560) 
            _height = 560;

        let width   = _width + 'px',
        height      = _height + 'px',
        photoCtnr   = _width - 360,
        halfHeight  = _height / 2;

        // dispatch(PhotoActions.modalPhoto(params, query, status, loading))
        this.setState({
            width: _width,
            height: _height,
            photoCtnr: photoCtnr,
            halfHeight: halfHeight,
        })
    },

    componentWillUpdate(nextProps, nextState) {
        if(this.props.match.params.id !== nextProps.match.params.id) {
            //
            console.log('in picture params changed')
        }
    },

    componentWillReceiveProps(nextProps) {
        
    },

    /**
     * render
     * @returns markup
     */
    render() {
        return(
            <ModalPhoto 
                {...this.state}
                onFollowRequest={this.onFollowRequest}
                onFriendConfirm={this.onFriendConfirm}
                onFriendRequest={this.onFriendRequest}
                onDeleteInvitation={this.onDeleteInvitation}
                onUnFollowRequest={this.onUnFollowRequest}
                {...this.props} 
            />
        )
    }
})

/**
 * connect
 * Connects React component to a Redux store
 * Documentation: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
 */
export default withRouter(connect(state => ({ 
    user: state.User.user,
    status: state.Photo.status,
    photosStore: state.Photos.photos,
    commentsStore: state.Comments.comments,
}))(ModalPicture))
