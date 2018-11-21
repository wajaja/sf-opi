import { Route, Switch }    from 'react-router-dom'
import React, { Component } from 'react'
const Post  = require('./../routes/post/posts/Post').default,
Video       = require('./../routes/media/videos/components/Video').default,
Sound       = require('./../routes/media/sounds/Sound').default, 
Home        = require('./../routes/social/Home/Home').default,
// MeetYou     = require('./../routes/social/MeetYou/MeetYou').default,
Welcome     = require('./../routes/social/Welcome/Welcome').default,
Group       = require('./../routes/user/group/Group').default,
Place       = require('./../routes/social/place/Place').default,
Search      = require('./../routes/social/search/Search').default,
NotMatched  = require('./../routes/social/Welcome/NotMatched').default,
Profile     = require('./../routes/user/profile/Profile').default,
Inbox       = require('./../routes/message/message/Inbox').default,
Hashtag     = require('./../routes/social/hashtag/Hashtag').default,
Login       = require('./../routes/user/security/Login').default,
Signup      = require('./../routes/user/registration/Signup').default,
Confirmed   = require('./../routes/user/confirmed/Confirmed').default,
Invitation  = require('./../routes/user/invitations/Invitation').default,
Notification = require('./../routes/social/notification/Notification').default,

Setting = require('./../routes/user/settings/Setting').default,
Resetting =require('./../routes/user/resettings/Resetting').default

import 'react-virtualized/styles.css'; // only needs to be imported once

import MyLoadable    from './../components/MyLoadable'

// const Setting = MyLoadable({loader: () => import('./../routes/user/settings/Setting')}),
// Resetting     = MyLoadable({loader: () => import('./../routes/user/resettings/Resetting')})

/** Auth Wrapper **/
// Applying to a function component for simplicity but could be Class or createClass component
// const AdminOnlyLink = VisibleOnlyAdmin(() => <Link to='/admin'>Admin Section</Link>)
class ProtectedRoute extends Component {
    render() {
        const { component: Component, ...props } = this.props

        return (
            <Route 
                {...props} 
                children={props => (
                    this.props.access_token ?
                    <Component {...this.props} /> : <Welcome {...this.props} />
                )} 
            />
        )
    }
}

class Root extends React.PureComponent {
    //location={props.customLocation} see https://reacttraining.com/react-router/web/example/modal-gallery
    constructor(props) {
        super(props);
    }

    
    render(){
        const props = this.props;
        return (
            <Switch location={props.customLocation}>
                <ProtectedRoute {...props} exact path="/" component={Home} />
                <Route path="/login" children={() => <Login {...props} />} />
                <Route path="/signup" children={() => 
                    <Signup 
                        {...props} 
                    />} 
                />
                <Route path="/confirmed" children={() => 
                    <Confirmed 
                        {...props} 
                    />} 
                />
                <Route path="/messages" children={() => 
                    <Inbox 
                        {...props} 
                    />} 
                />
                <Route path="/videos/:id" children={() => 
                    <Video 
                        {...props} 
                    />} 
                />
                <Route path="/streams" children={() => 
                    <Sound 
                        {...props}  
                    />} 
                />
                <Route path="/posts/:id" children={() => 
                    <Post 
                        {...props} 
                    />} 
                />
                <Route path="/settings" children={() => 
                    <Setting 
                        {...props} 
                    />} 
                />
                <Route path="/resetting" children={() => 
                    <Resetting 
                        {...props} 
                    />} 
                />
                <Route path="/groups" children={() => 
                    <Group 
                        {...props} 
                    />} 
                />
                <Route path="/places" children={() => 
                    <Place 
                        {...props} 
                    />} 
                />
                <Route path="/search" children={() => 
                    <Search 
                        {...props}  
                    />} 
                />
                <Route path="/invitations" children={() => 
                    <Invitation 
                        {...props}  
                    />} 
                />
                <Route path="/notifications" children={() => 
                    <Notification 
                        {...props} 
                    />} 
                />
                <Route path="/hashtag/:word" children={() => 
                    <Hashtag 
                        {...props} 
                    />} 
                />
                <Route exact strict path="/:username" children={() => 
                    <Profile 
                        {...props} 
                    />} 
                />
                {typeof window !== 'undefined' && <Route  children={(rest) => <NotMatched {...props} {...rest} />} />}
            </Switch>
        )
    }
}
                // <Route path="/meetyou" children={() => 
                //     <MeetYou 
                //         {...props}  
                //     />} 
                // />

export default Root