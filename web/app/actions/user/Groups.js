import axios                from 'axios'
import _                    from 'lodash'


export const LOAD_LIST = 'GROUPS::LOAD_LIST'
export const LOAD_LIST_RESPONSE = 'GROUPS::LOAD_LIST_RESPONSE'
export const _loadListResponse = (groups) => ({type: LOAD_LIST_RESPONSE, groups }) 

export function loadList(userId) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/groups/list`).then(
                (res) => {
                    console.log(res.data)
                    const { groups } = res.data;
                    dispatch(_loadListResponse(groups))
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

export const LOAD_SUGGESTION = 'GROUPS::LOAD_SUGGESTION'

export const LOAD_SUGGESTION_RESPONSE = 'GROUPS::LOAD_SUGGESTION_RESPONSE'

export const _loadSuggestionResponse = (groups) => ({type: LOAD_SUGGESTION_RESPONSE, groups }) 

export function loadSuggestion(userId) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/groups/suggestion`).then(
                (res) => {
                    console.log(res.data)
                    const { groups } = res.data;
                    dispatch(_loadSuggestionResponse(groups))
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


export const LOAD_GROUP = 'GROUPS::LOAD_GROUP'

export const LOAD_GROUP_RESPONSE = 'GROUPS::LOAD_GROUP_RESPONSE'

export const _loadGroupResponse = (name, group, newsRefs, photos) => ({
    type: LOAD_GROUP_RESPONSE, name, group, newsRefs, photos 
}) 

export function loadGroup(id) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/groups/show/${id}`).then(
                (res) => {
                    console.log(res.data)
                    const { group, newsRefs, photos } = res.data;
                    dispatch(_loadGroupResponse(id, group, newsRefs, photos))
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

export const CREATE_REQUEST  = 'GROUPS::CREATE_REQUEST'

const createGroupReq = () => ({type: CREATE_REQUEST, submitting: true,})

export const CREATE_RESPONSE  = 'GROUPS::CREATE_RESPONSE'

export const createGroupRes = (data) => ({type: CREATE_RESPONSE, data })

export function createGroup(data) {
    return (dispatch, getState) => {
        dispatch(createGroupReq())
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_PATH}/api/groups/new`, data).then(
                (res) => {
                    console.log(res.data)
                    const { data } = res.data;
                    dispatch(createGroupRes(data));
                    resolve(data)
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

export const EDIT_REQUEST  = 'GROUPS::EDIT_REQUEST'

const editGroupReq = () => ({type: EDIT_REQUEST, submitting: true,})

export const EDIT_RESPONSE  = 'GROUPS::EDIT_RESPONSE'

export const editGroupRes = (data) => ({type: EDIT_RESPONSE, data })

export function editGroup(data) {
    return (dispatch, getState) => {
        dispatch(editGroupReq())
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_PATH}/api/groups/edit`, data).then(
                (res) => {
                    console.log(res.data)
                    const { data } = res.data;
                    dispatch(editGroupRes(data));
                    resolve(data)
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