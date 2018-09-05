import { persistStore,
		 purgeStoredState
		} 						from 'redux-persist'
import { persistorConfig }      from '../../store/configureStore'
import axios 					from 'axios'
import { BASE_PATH }        	from '../../config/api'

const logout =  function (store) {

	store.dispatch({ type: 'USER::LOGOUT' })

	//remove stored token
    localStorage.removeItem('_tk_key');

    //purge redux-persist storage
    return purgeStoredState(persistorConfig)
    //dispatch REHYDRATE to add initialState from server to persistor
    // store.dispatch({
    //     type: 'persist/REHYDRATE',
    //     key: persistorConfig.key,
    //     payload: undefined
    // })
}

export default logout