import _                    from 'lodash'
import { 
    NewsFeed as NewsFeedActions,
}                           from '../../actions'
import axios            from 'axios'
import { BASE_PATH }    from '../../config/api'




export const LOAD_PROFILE = 'PROFILES::LOAD_PROFILE'

export const LOAD_PROFILE_RESPONSE = 'PROFILES::LOAD_PROFILE_RESPONSE'

export const _loadProfileResponse = (username, user, newsRefs, photos) => ({
    type: LOAD_PROFILE_RESPONSE, username, user, newsRefs, photos 
}) 

export function loadProfile(username) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/users/${username}`).then(
                (res) => {
                    console.log(res.data)
                    const { user, newsRefs, photos, news } = res.data,
                    posts = news
                    dispatch(_loadProfileResponse(username, user, newsRefs, photos))
                    dispatch(NewsFeedActions.addPosts(posts))
                    resolve(res.data)
                },
                (error) => {
                    if(error.response) {
                        console.log(error.response.data);   
                        console.log(error.response.status);
                        console.log(error.response.headers);                
                    } else if(error.request) {
                        console.log(error.request);
                    } else {
                        console.log(error.message);
                    }
                    console.log(error.config);
                    reject(error)
                })
        })
    }
}

export const LOAD_PHOTOS = 'PROFILES::LOAD_PHOTOS'

export const LOAD_PHOTOS_RESPONSE = 'PROFILES::LOAD_PHOTOS_RESPONSE'

export const _loadPhotosResponse = (username, photos) => ({
    type: LOAD_PHOTOS_RESPONSE, username, photos 
})

export function loadPhotos(username) {
    return (dispatch, getState) => {
        const _photos = getState().Profiles.users[username].photos,
        initIds = _photos.map((ref) => ref.id)
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/photos/load/${username}`, { 
                    params : {
                        initIds: initIds
                    }}).then(
                (res) => {
                    console.log(res.data)
                    const { photos } = res.data;
                    dispatch(_loadPhotosResponse(username, photos));
                    resolve(res.data.photos)
                },
                (error) => {
                    if(error.response) {
                        console.log(error.response.data);   
                        console.log(error.response.status);
                        console.log(error.response.headers);                
                    } else if(error.request) {
                        console.log(error.request);
                    } else {
                        console.log(error.message);
                    }
                    console.log(error.config);
                    reject(error)
                })
        })
    }
}


export const LOAD_INFOS = 'PROFILES::LOAD_INFOS'

export const LOAD_INFOS_RESPONSE = 'PROFILES::LOAD_INFOS_RESPONSE'

export const _loadInfosResponse = (username, infos) => ({
    type: LOAD_INFOS_RESPONSE, username, infos 
})

export function loadInfos(username) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/infos/load/${username}`).then(
                (res) => {
                    // console.log(res.data)
                    // const { }
                    const infos = res.data;
                    dispatch(_loadInfosResponse(username, infos));
                    resolve(res.data)
                },
                (error) => {
                    if(error.response) {
                        console.log(error.response.data);   
                        console.log(error.response.status);
                        console.log(error.response.headers);                
                    } else if(error.request) {
                        console.log(error.request);
                    } else {
                        console.log(error.message);
                    }
                    console.log(error.config);
                    reject(error)
                })
        })
    }
}


export const LOAD_TIMELINE = 'PROFILES::LOAD_TIMELINE'

export const LOAD_TIMELINE_RESPONSE = 'PROFILES::LOAD_TIMELINE_RESPONSE'

export const _loadTimelineResponse = (username, news, newsRefs) => ({
    type: LOAD_TIMELINE_RESPONSE, username, news, newsRefs,
}) 

export function loadTimeline(username, page) {
    return (dispatch, getState) => {
        const _newRefs = getState().Profiles[username].newsRefs,
        initIds = _newRefs.map((ref) => ref.id)
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/timeline/load/${username}?page=${page}`).then(
                (res) => {
                    console.log(res.data)
                    //add authors & lastStreamId
                    const { news, newsRefs, lastStreamId, authors } = res.data;
                    dispatch(_loadTimelineResponse(username, news, newsRefs))
                    dispatch(NewsFeedActions.addPosts(news))
                    resolve(res.data)
                },
                (error) => {
                    if(error.response) {
                        console.log(error.response.data);   
                        console.log(error.response.status);
                        console.log(error.response.headers);                
                    } else if(error.request) {
                        console.log(error.request);
                    } else {
                        console.log(error.message);
                    }
                    console.log(error.config);
                    reject(error)
                })
        })
    }
}



export const LOAD_TIMELINE_BY_YEAR = 'PROFILES::LOAD_TIMELINE_BY_YEAR'

export function loadTimelineByYear(username, year) {
    return (dispatch, getState) => {
        const _newRefs = getState().Profiles[username].newsRefs,
        initIds = _newRefs.map((ref) => ref.id)
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/timeline/${username}`, { 
                    params : {
                        initIds: initIds,
                        year: year
                    }}).then(
                (res) => {
                    console.log(res.data)
                    const { news, newsRefs } = res.data;
                    dispatch(_loadTimelineResponse(username, news, newsRefs))
                    dispatch(NewsFeedActions.addPosts(news))
                    resolve(res.data)
                },
                (error) => {
                    if(error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);                
                    } else if(error.request) {
                        console.log(error.request);
                    } else {
                        console.log(error.message);
                    }
                    console.log(error.config);
                    reject(error)
                })
        })
    }
}

export const LOAD_FRIENDS = 'PROFILES::LOAD_FRIENDS'

export const LOAD_FRIENDS_RESPONSE = 'PROFILES::LOAD_FRIENDS_RESPONSE'

export const _loadFriendsResponse = (username, friends) => ({
    type: LOAD_FRIENDS_RESPONSE, username, friends,
}) 

export function loadRelationship(username, page) {
    return (dispatch, getState) => {
        // const _friends = getState().Profiles[username].friends || [],
        // initIds = _friends.map((ref) => ref.id)
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/friends/load/${username}?page=${page}`).then(
                (res) => {
                    console.log(res.data)
                    const friends = res.data;
                    dispatch(_loadFriendsResponse(username, friends))
                    resolve(res.data)
                },
                (error) => {
                    if(error.response) {
                        console.log(error.response.data);   
                        console.log(error.response.status);
                        console.log(error.response.headers);                
                    } else if(error.request) {
                        console.log(error.request);
                    } else {
                        console.log(error.message);
                    }
                    console.log(error.config);
                    reject(error)
                })
        })
    }
}

export const LOAD_FOLLOWERS = 'PROFILES::LOAD_FOLLOWERS'

export const LOAD_FOLLOWERS_RESPONSE = 'PROFILES::LOAD_FOLLOWERS_RESPONSE'

export const _loadFollowersResponse = (username, followers) => ({
    type: LOAD_FOLLOWERS_RESPONSE, username, followers,
}) 

export function loadFollowers(username, page) {
    return (dispatch, getState) => {
        const _friends = getState().Profiles[username].followers || [],
        initIds = _friends.map((ref) => ref.id)
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/followers/${username}?page=${page}`).then(
                (res) => {
                    console.log(res.data)
                    const { users } = res.data;
                    dispatch(_loadFollowersResponse(username, users))
                    resolve(res.data)
                },
                (error) => {
                    if(error.response) {
                        console.log(error.response.data);   
                        console.log(error.response.status);
                        console.log(error.response.headers);                
                    } else if(error.request) {
                        console.log(error.request);
                    } else {
                        console.log(error.message);
                    }
                    console.log(error.config);
                    reject(error)
                })
        })
    }
}

export const USER_INFO = 'PROFILES::USER_INFO'

export const USER_INFO_RESPONSE = 'PROFILES::USER_INFO_RESPONSE'

//See in usersSaga for op detail
export const _userInfoResponse = (username, info) => ({
    type: USER_INFO_RESPONSE, username, info,
}) 

export function userInfo(username) {
    return (dispatch, getState) => {
        dispatch({type: 'PROFILES::USER_INFO_REQUEST', username })
    }
}

// export function loadRelationship(username, page){
//     loadFriends(username, page);
//     // loadFollowers(username, page);
// }

export const LOAD_OPINIONS = 'PROFILES::LOAD_OPINIONS'

export const LOAD_OPINIONS_RESPONSE = 'PROFILES::LOAD_OPINIONS_RESPONSE'

export const _loadOpinionsResponse = (username, opinions) => ({
    type: LOAD_OPINIONS_RESPONSE, username, opinions,
}) 

export function loadOpinions(username) {
    return (dispatch, getState) => {
        const _opns = getState().Profiles[username].opinions || [],
        initIds = _opns.map((ref) => ref.id)
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/opinions/${username}`, { 
                    params : {
                        initIds: initIds,
                    }}).then(
                (res) => {
                    console.log(res.data)
                    const { news } = res.data;
                    dispatch(_loadTimelineResponse(username, news, newsRefs))
                    dispatch(NewsFeedActions.addPosts(news))
                    resolve(res.data)
                },
                (error) => {
                    if(error.response) {
                        console.log(error.response.data);   
                        console.log(error.response.status);
                        console.log(error.response.headers);                
                    } else if(error.request) {
                        console.log(error.request);
                    } else {
                        console.log(error.message);
                    }
                    console.log(error.config);
                    reject(error)
                })
        })
    }
}

export const ADD_PROFILE = 'PROFILES::ADD_PROFILE'
// Action creators can be impure.
export const addProfile = ({
    // cuid is safer than random uuids/v4 GUIDs
    // see usecuid.org
    id = '',
    username = '',
    email = '',
    firstname = '',
    lastname = '',
    profilePic= '',
    coverPic = '',
    follower = false,
    following = false,
    followerIds = [],
    followingIds = [],
    diaries = {},
    timelineRefs = []
} = {}) => ({
    type: ADD_PROFILE,
    payload: { 
        id, firstname, lastname, email, 
        username, profilePic, coverPic,
        follower, following, followerIds, 
        followingIds, diaries, timelineRefs, 
    }
});


export const CHANGE_STATUS = 'PROFILES::CHANGE_STATUS'
export const changeStatus = (statusMessage = 'Online') => ({
    type: CHANGE_STATUS,
    payload: { statusMessage }
});


export const CHANGE_USERNAME = 'PROFILES::CHANGE_USERNAME'
export const changeUserName = (userName = 'Anonymous') => ({
    type: CHANGE_USERNAME,
    payload: { userName }
});