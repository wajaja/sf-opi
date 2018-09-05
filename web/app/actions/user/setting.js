import axios 			from 'axios'
import { BASE_PATH }    from '../../config/api'

export const SUBMIT_ADRESS_REQUEST  = 'USER::SUBMIT_ADRESS_REQUEST'

const submitAdressReq = () => ({type: SUBMIT_ADRESS_REQUEST, submitting: true,})

export const SUBMIT_ADRESS_RESPONSE  = 'USER::SUBMIT_ADRESS_RESPONSE'

export const submitAdressRes = (data) => ({type: SUBMIT_ADRESS_RESPONSE, data, submitting:false })

export function submitAdress(data) {
    return (dispatch, getState) => {
        dispatch(submitAdressReq());
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_PATH}/api/setting/adress`, data).then(
                (res) => {
                    const { data } = res;
                    console.log(res.data)
                    dispatch(submitAdressRes(data));
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


export const SUBMIT_NAME_REQUEST  = 'USER::SUBMIT_NAME_REQUEST'

const submitNameReq = () => ({type: SUBMIT_NAME_REQUEST, submitting: true,})

export const SUBMIT_NAME_RESPONSE  = 'USER::SUBMIT_NAME_RESPONSE'

export const submitNameRes = (data) => ({type: SUBMIT_NAME_RESPONSE, data, submitting:false })

export function submitName(data) {
    return (dispatch, getState) => {
        dispatch(submitNameReq());
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_PATH}/api/setting/name`, data).then(
                (res) => {
                    const { data } = res;
                    console.log(res.data)
                    dispatch(submitNameRes(data));
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

export const SUBMIT_LANG_REQUEST  = 'USER::SUBMIT_LANG_REQUEST'

const submitLangReq = () => ({type: SUBMIT_LANG_REQUEST, submitting: true,})

export const SUBMIT_LANG_RESPONSE  = 'USER::SUBMIT_LANG_RESPONSE'

export const submitLangRes = (data) => ({type: SUBMIT_LANG_RESPONSE, data, submitting:false })

export function submitLang(data) {
    return (dispatch, getState) => {
        dispatch(submitLangReq());
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_PATH}/api/setting/lang`, data).then(
                (res) => {
                    const { data } = res;
                    console.log(res.data)
                    dispatch(submitLangRes(data));
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
export const SUBMIT_PASSWORD_REQUEST  = 'USER::SUBMIT_PASSWORD_REQUEST'

const submitPasswordReq = () => ({type: SUBMIT_PASSWORD_REQUEST, submitting: true,})

export const SUBMIT_PASSWORD_RESPONSE  = 'USER::SUBMIT_PASSWORD_RESPONSE'

export const submitPasswordRes = (data) => ({type: SUBMIT_PASSWORD_RESPONSE, data, submitting:false })

export function submitPassword(data, userId) {
    return (dispatch, getState) => {
        dispatch(submitPasswordReq());
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_PATH}/api/setting/password/${userId}`, data).then(
                (res) => {
                    const { data } = res;
                    console.log(res.data)
                    dispatch(submitPasswordRes(data));
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
export const SUBMIT_PHONE_REQUEST  = 'USER::SUBMIT_PHONE_REQUEST'

const submitPhoneReq = () => ({type: SUBMIT_PHONE_REQUEST, submitting: true,})

export const SUBMIT_PHONE_RESPONSE  = 'USER::SUBMIT_PHONE_RESPONSE'

export const submitPhoneRes = (data) => ({type: SUBMIT_PHONE_RESPONSE, data, submitting:false })

export function submitPhone(data) {
    return (dispatch, getState) => {
        dispatch(submitPhoneReq());
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_PATH}/api/setting/phone`, data).then(
                (res) => {
                    const { data } = res;
                    console.log(res.data)
                    dispatch(submitPhoneRes(data));
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
export const SUBMIT_STATUS_REQUEST  = 'USER::SUBMIT_STATUS_REQUEST'

const submitStatusReq = () => ({type: SUBMIT_STATUS_REQUEST, submitting: true,})

export const SUBMIT_STATUS_RESPONSE  = 'USER::SUBMIT_STATUS_RESPONSE'

export const submitStatusRes = (data) => ({type: SUBMIT_STATUS_RESPONSE, data, submitting:false })

export function submitStatus(data) {
    return (dispatch, getState) => {
        dispatch(submitStatusReq());
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_PATH}/api/setting/status`, data).then(
                (res) => {
                    const { data } = res;
                    console.log(res.data)
                    dispatch(submitStatusRes(data));
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
export const SUBMIT_ABOUT_ME_REQUEST  = 'USER::SUBMIT_ABOUT_ME_REQUEST'

const submitAboutMeReq = () => ({type: SUBMIT_ABOUT_ME_REQUEST, submitting: true,})

export const SUBMIT_ABOUT_ME_RESPONSE  = 'USER::SUBMIT_ABOUT_ME_RESPONSE'

export const submitAboutMeRes = (data) => ({type: SUBMIT_ABOUT_ME_RESPONSE, data, submitting:false })

export function submitAboutMe(data) {
    return (dispatch, getState) => {
        dispatch(submitAboutMeReq());
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_PATH}/api/setting/aboutme`, data).then(
                (res) => {
                    const { data } = res;
                    console.log(res.data)
                    dispatch(submitAboutMeRes(data));
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

export const SET_NOTIF_BY_EMAIL_REQUEST  = 'USER::SET_NOTIF_BY_EMAIL_REQUEST'

const setNotifByEmailReq = () => ({type: SET_NOTIF_BY_EMAIL_REQUEST, submitting: true,})

export const SET_NOTIF_BY_EMAIL_RESPONSE  = 'USER::SET_NOTIF_BY_EMAIL_RESPONSE'

export const setNotifByEmailRes = (data) => ({type: SET_NOTIF_BY_EMAIL_RESPONSE, data, submitting:false })

export function setNotifByEmail(data) {
    return (dispatch, getState) => {
        dispatch(setNotifByEmailReq());
        return new Promise((resolve, reject) => {
            axios.post(`${BASE_PATH}/api/setting/notification`, data).then(
                (res) => {
                    const { data } = res;
                    console.log(res.data)
                    dispatch(setNotifByEmailRes(data));
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



export const SECURITY_REQUEST  = 'USER::SECURITY_REQUEST'

const securityReq = () => ({type: SECURITY_REQUEST,})

export const SECURITY_RESPONSE  = 'USER::SECURITY_RESPONSE'

export const securityRes = (data) => ({type: SECURITY_RESPONSE, data, })

export function security() {
    return (dispatch, getState) => {
        dispatch(securityReq());
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/setting/load/security`).then(
                (res) => {
                    const { data } = res;
                    console.log(data)
                    dispatch(securityRes(data));
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

export const NOTIFICATION_REQUEST  = 'USER::NOTIFICATION_REQUEST'

const notificationReq = () => ({type: NOTIFICATION_REQUEST,})

export const NOTIFICATION_RESPONSE  = 'USER::NOTIFICATION_RESPONSE'

export const notificationRes = (data) => ({type: NOTIFICATION_RESPONSE, data, })

export function notification() {
    return (dispatch, getState) => {
        dispatch(notificationReq());
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/setting/load/notification`).then(
                (res) => {
                    const { data } = res;
                    console.log(data)
                    dispatch(notificationRes(data));
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

export const CONTACT_REQUEST  = 'USER::CONTACT_REQUEST'

const contactReq = () => ({type: CONTACT_REQUEST,})

export const CONTACT_RESPONSE  = 'USER::CONTACT_RESPONSE'

export const contactRes = (data) => ({type: CONTACT_RESPONSE, data, })

export function contact() {
    return (dispatch, getState) => {
        dispatch(contactReq());
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/setting/load/contact`).then(
                (res) => {
                    const { data } = res;
                    dispatch(contactRes(data));
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

export const ADRESS_REQUEST  = 'USER::ADRESS_REQUEST'

const adressReq = () => ({type: ADRESS_REQUEST,})

export const ADRESS_RESPONSE  = 'USER::ADRESS_RESPONSE'

export const adressRes = (data) => ({type: ADRESS_RESPONSE, data, })

export function adress() {
    return (dispatch, getState) => {
        dispatch(adressReq());
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/setting/load/adress`).then(
                (res) => {
                    const { data } = res;
                    console.log(data)
                    dispatch(adressRes(data));
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

export const GENERAL_REQUEST  = 'USER::GENERAL_REQUEST'

const generalReq = () => ({type: GENERAL_REQUEST,})

export const GENERAL_RESPONSE  = 'USER::GENERAL_RESPONSE'

export const generalRes = (data) => ({type: GENERAL_RESPONSE, data, })

export function general() {
    return (dispatch, getState) => {
        dispatch(generalReq());
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/setting/load/general`).then(
                (res) => {
                    console.log(res.data)
                    const { data } = res;
                    dispatch(generalRes(data));
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

export const ABOUT_ME_REQUEST  = 'USER::ABOUT_ME_REQUEST'

const aboutmeReq = () => ({type: ABOUT_ME_REQUEST,})

export const ABOUT_ME_RESPONSE  = 'USER::ABOUT_ME_RESPONSE'

export const aboutmeRes = (data) => ({type: ABOUT_ME_RESPONSE, data, })

export function aboutme() {
    return (dispatch, getState) => {
        dispatch(aboutmeReq());
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/setting/load/aboutme`).then(
                (res) => {
                    console.log(res.data)
                    const { data } = res;
                    dispatch(aboutmeRes(data));
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