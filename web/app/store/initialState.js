
export default {
    User: require('./../reducers/user/User').initialState,
    Auth: require('./../reducers/user/auth').initialState,
    Diary: require('./../reducers/user/Diary').initialState,
    Groups: require('./../reducers/user/Groups').initialState,
    Login: require('./../reducers/user/Login').initialState,
    Signup: require('./../reducers/user/Signup').initialState,
    Profiles: require('./../reducers/user/Profiles').initialState,
    Invitation: require('./../reducers/user/Invitation').initialState,
    RelationShip: require('./../reducers/user/RelationShip').initialState,

    App: require('./../reducers/social/App').initialState,
    Place: require('./../reducers/social/Place').initialState,
    Search: require('./../reducers/social/Search').initialState,
    NewsFeed: require('./../reducers/social/NewsFeed').initialState,
    PostForm: require('./../reducers/social/PostForm').initialState,
    Exception: require('./../reducers/social/Exception').initialState,
    Confidence: require('./../reducers/social/Confidence').initialState,
    Notification: require('./../reducers/social/Notification').initialState,
    // PostFormType: require('./../reducers/social/PostFormType').initialState,
    VideoUploader: require('./../reducers/social/VideoUploader').initialState,

    Posts: require('./../reducers/post/Posts').initialState,
    Shares: require('./../reducers/post/Shares').initialState,
    Authors: require('./../reducers/post/Authors').initialState,
    Comments: require('./../reducers/post/Comments').initialState,
    UnderComments: require('./../reducers/post/UnderComments').initialState,

    Message: require('./../reducers/message/Message').initialState,
    Secrets: require('./../reducers/message/Secrets').initialState,
    Questions: require('./../reducers/message/Questions').initialState,

    Photo: require('./../reducers/media/Photo').initialState,
    Stream: require('./../reducers/media/Stream').initialState,
    Photos: require('./../reducers/media/Photos').initialState,
    EveryWhere: require('./../reducers/media/EveryWhere').initialState,
    Videos: require('./../reducers/media/Videos').initialState
}