
export const SET = 'SET'


export function set(name, value) {
    return {
        type: SET,
        name,
        value,
    }
}