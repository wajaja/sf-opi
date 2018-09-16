import axios                from 'axios'

export const PW_FORGOTED_REQ = 'LOGIN::PW_FORGOTED_REQ'
export const PW_FORGOTED_RES = 'LOGIN::PW_FORGOTED_RES'


export const _passwordForgot = (username) => ({type: PW_FORGOTED_RES, username }) 