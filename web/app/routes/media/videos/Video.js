import React                        from 'react'
import createReactClass             from 'create-react-class'
import { 
    Link, Route, withRouter,
    Switch 
}                                   from 'react-router-dom'
import { connect }                  from 'react-redux'
import classnames                   from 'classnames'
import * as axios                   from 'axios'
import { BASE_PATH }                from '../../../config/api'
import { Video as VideoComponent, } from './components'

import { 
    Questions as QuestionsActions,
    Responses as ResponsesActions,
    Authors as AuthorsActions,
    Video as VideoActions,
    App as AppActions
}                                   from '../../../actions'

import '../../../styles/media/video.scss'

const NoMatch = ({ location }) => (
    <div>
        <h3>
            No match for <code>{location.pathname}</code>
        </h3>
    </div>
);


const Video  = createReactClass({

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
            videoCtnr: '450px',
            halfHeight: '250px',
        }
    },

    componentDidMount() {
        //next images in this post
        //perform ajax request for getting next video id on this one
        const { dispatch, params, location: {query, pathname } } = this.props,
        loading     = false,
        postId      = params.id,
        status      = { modal: true, returnTo: pathname },
        winWidth    = window.innerWidth,
        winHeight   = window.innerHeight,
        width       = (winWidth - (60 * 2)) + 'px',
        height      = (winHeight - (25 * 2)) + 'px',
        videoCtnr   = ((winWidth - (60 * 2)) - 360) + 'px',
        halfHeight  = ((winHeight - (25 * 2)) / 2) + 'px';

        // dispatch(VideoActions.modalVideo(params, query, status, loading))

        this.setState({
            width: width,
            height: height,
            videoCtnr: videoCtnr,
            halfHeight: halfHeight,
        })
    },

    componentWillUpdate(nextProps, nextState) {
        if(this.props.params.id !== nextProps.params.id) {
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
        const { match, id }   = this.props
        return(
            <Switch>
                <Route exact path="/:id"
                    children={() => 
                        <VideoComponent 
                            {...this.state}
                            onFollowRequest={this.onFollowRequest}
                            onFriendConfirm={this.onFriendConfirm}
                            onFriendRequest={this.onFriendRequest}
                            onDeleteInvitation={this.onDeleteInvitation}
                            onUnFollowRequest={this.onUnFollowRequest}
                            {...this.props} 
                        />
                    }
                />
                <Route exact path='/' children={() => <List {...this.props} />} />
                <Redirect component={NoMatch} />
            </Switch>
        )è
    }
})
////////////
/**
 * connect
 * Connects React component to a Redux store
 * Documentation: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
 */
export default withRouter(Video)
