import axios                        from 'axios'

/**
 * INIT
 * @type {string}
 */
export const THROW_NEW_EXCEPTION = 'APP::THROW_NEW_EXCEPTION'

/**
* the exception can be an instance of JWTDecodeFailureException
* With message like >>> Invalid JWT Token || Expired JWT Token
*/
export function throwNewEception(status = false, message='') {
    return {
        type: THROW_NEW_EXCEPTION,
        status,
        message,
    }
}