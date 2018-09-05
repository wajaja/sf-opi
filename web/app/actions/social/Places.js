import axios                from 'axios'
import _                    from 'lodash'


export const LOAD_LIST = 'PLACES::LOAD_LIST'
export const LOAD_LIST_RESPONSE = 'PLACES::LOAD_LIST_RESPONSE'
export const _loadListResponse = (places) => ({type: LOAD_LIST_RESPONSE, places }) 

export function loadList(userId) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/places/list`).then(
                (res) => {
                    console.log(res.data)
                    const { places } = res.data;
                    dispatch(_loadListResponse(places))
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

export const LOAD_SUGGESTION = 'PLACES::LOAD_SUGGESTION'

export const LOAD_SUGGESTION_RESPONSE = 'PLACES::LOAD_SUGGESTION_RESPONSE'

export const _loadSuggestionResponse = (places) => ({type: LOAD_SUGGESTION_RESPONSE, places }) 

export function loadSuggestion(userId) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/places/suggestion`).then(
                (res) => {
                    console.log(res.data)
                    const { places } = res.data;
                    dispatch(_loadSuggestionResponse(places))
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


export const LOAD_PLACE = 'PLACES::LOAD_PLACE'

export const LOAD_PLACE_RESPONSE = 'PLACES::LOAD_PLACE_RESPONSE'

export const _loadPlaceResponse = (name, place, newsRefs, photos) => ({
    type: LOAD_PLACE_RESPONSE, name, place, newsRefs, photos 
}) 

export function loadPlace(name) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/places/${name}`).then(
                (res) => {
                    console.log(res.data)
                    const { place, newsRefs, photos } = res.data;
                    dispatch(_loadPlaceResponse(name, place, newsRefs, photos))
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

export const CREATE_REQUEST  = 'PLACES::CREATE_REQUEST'

const createPlaceReq = () => ({type: CREATE_REQUEST, submitting: true,})

export const CREATE_RESPONSE  = 'PLACES::CREATE_RESPONSE'

export const createPlaceRes = (data) => ({type: CREATE_RESPONSE, data })

export function createPlace(data) {
    return (dispatch, getState) => {
        dispatch(createPlaceReq())
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_PATH}/api/places/new`, data).then(
                (res) => {
                    console.log(res.data)
                    const { data } = res.data;
                    dispatch(createPlaceRes(data));
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

export const EDIT_REQUEST  = 'PLACES::EDIT_REQUEST'

const editPlaceReq = () => ({type: EDIT_REQUEST, submitting: true,})

export const EDIT_RESPONSE  = 'PLACES::EDIT_RESPONSE'

export const editPlaceRes = (data) => ({type: EDIT_RESPONSE, data })

export function editPlace(data) {
    return (dispatch, getState) => {
        dispatch(editPlaceReq())
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_PATH}/api/places/edit`, data).then(
                (res) => {
                    console.log(res.data)
                    const { data } = res.data;
                    dispatch(editPlaceRes(data));
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