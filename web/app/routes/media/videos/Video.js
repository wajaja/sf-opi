import React                        from 'react'
import createReactClass             from 'create-react-class'
import { 
    Link, Route, withRouter,
    Switch, Redirect 
}                                   from 'react-router-dom'
import { connect }                  from 'react-redux'
import classnames                   from 'classnames'
import * as axios                   from 'axios'
import { BASE_PATH }                from '../../../config/api'


import { Video as VideoComponent, } from './components'
import  VideosHome      from "./VideosHome";
import MyLoadable       from '../../../components/MyLoadable'
 
const VideoSuggestList = MyLoadable({loader: () => import('../../../components/media/VideoSuggestList')})


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
        const { match, id, location }   = this.props
        console.log(location);
        return(
            <Switch location={location}>
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
                <Route path='/' children={() => <VideosHome {...this.props} />} />
                <Redirect to="/" component={NoMatch} />
            </Switch>
        )
    }
})
////////////
/**
 * connect
 * Connects React component to a Redux store
 * Documentation: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
 */
export default withRouter(Video)
