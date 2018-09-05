import { Route, Switch } from 'react-router-dom'
import React 			from 'react'
const Post  = require('./../routes/post/posts/Post').default,
ModalPicture = require('./../routes/media/pictures/ModalPicture').default,
Video       = require('./../routes/media/videos/Video').default,
Sound       = require('./../routes/media/sounds/Sound').default, 
Home        = require('./../routes/social/Home/Home').default,
Group       = require('./../routes/user/group/Group').default,
Place       = require('./../routes/social/place/Place').default,
Search      = require('./../routes/social/search/Search').default,
Profile     = require('./../routes/user/profile/Profile').default,
Inbox       = require('./../routes/message/message/Inbox').default,
Setting     = require('./../routes/user/settings/Setting').default,
Hashtag     = require('./../routes/social/hashtag/Hashtag').default,
Confirmed   = require('./../routes/user/confirmed/Confirmed').default,
Invitation  = require('./../routes/user/invitations/Invitation').default,
Notification = require('./../routes/social/notification/Notification').default

import 'react-virtualized/styles.css'; // only needs to be imported once
// import SearchRoute       from './../routes/social/search'
// import ExploreRoute      from './../routes/social/explore'
// import PublicityRoute    from './../routes/social/publicity'
// import LocationRoute     from './../routes/social/location'
// import PostRoute         from './../routes/post/post'
// import OpinionRoute      from './../routes/post/opinion'
// import PollRoute         from './../routes/post/poll'
// import PictureRoute      from './../routes/media/picture'
// import VideoRoute        from './../routes/media/video'
// import DocumentRoute     from './../routes/media/document'
// import RecordRoute       from './../routes/media/mediastream'
// import MessageRoute      from './../routes/message/message'
// import QuestionRoute     from './../routes/message/question'
// import GroupRoute        from './../routes/user/group'
// import DiaryRoute        from './../routes/user/diary'


/** Auth Wrapper **/
// Applying to a function component for simplicity but could be Class or createClass component
// const AdminOnlyLink = VisibleOnlyAdmin(() => <Link to='/admin'>Admin Section</Link>)
// Show Admin dashboard to admins and user dashboard to regular users
// <Route path='/dashboard' component={AdminOrElse(AdminDashboard, UserDashboard)} />


// <SearchRoute        path="/search"      component={require('./../routes/social/search/Search').default} {...props} />
// <ExploreRoute       path="/explore"     component={require('./../routes/social/explore/Expore').default} {...props} />
// <PublicityRoute     path="/publicity"   component={require('./../routes/social/publicity/Publicity').default} {...props} />
// <LocationRoute      path="/location"    component={require('./../routes/social/location/Location').default} {...props} />
// <NotificationRoute  path="/notification" component={require('./../routes/social/notification/Notification').default} {...props} />
// <PostRoute          path="/posts"       component={require('./../routes/post/post/Post').default} {...props} />
// <OpinionRoute       path="/opinions"    component={require('./../routes/post/opinion/Opinion').default} {...props} />
// <PollRoute          path="/polls"       component={require('./../routes/post/poll/Poll').default} {...props} />
// <PictureRoute       path="/pictures"    component={require('./../routes/media/picture/Picture').default} {...props} />
// <VideoRoute         path="/videos"      component={require('./../routes/media/video/Video').default} {...props} />
// <DocumentRoute      path="/documents"   component={require('./../routes/media/document/Document').default} {...props} />
// <RecordRoute        path="/record"      component={require('./../routes/media/mediastream/Record').default} {...props} />
// <MessageRoute       path="/messages"    component={require('./../routes/message/message/Message').default} {...props} />
// <QuestionRoute      path="/questions"   component={require('./../routes/message/question/Question').default} {...props} />
// <GroupRoute         path="/groups"      component={require('./../routes/user/group/Group').default} {...props} />
// <ProfileRoute       path="/:username"   component={require('./../routes/user/profile/Profile').default} {...props} />
// <DiaryRoute         path="/diaries"     component={require('./../routes/user/diary/Diary').default} {...props} />
            // <Route path="/pictures/:id" children={() => <ModalPicture {...props} />} />

class Root extends React.PureComponent {
    //location={props.customLocation} see https://reacttraining.com/react-router/web/example/modal-gallery
    constructor(props) {
        super(props);
    }

    
    render(){
        const props = this.props;
        return (
            <Switch location={props.customLocation}>
                <Route exact path="/" children={() => 
                    <Home 
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
                <Route path="/videos" children={() => 
                    <Video 
                        {...props} 
                    />} 
                />
                <Route path="/sound" children={() => 
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
                <Route path="/groups" children={() => 
                    <Group 
                        {...props} 
                    />} 
                />
                <Route path="/places" children={() => 
                    <Places 
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
            </Switch>
        )
    }
}

export default Root