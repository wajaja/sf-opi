import { call, put, fork, 
		select, takeEvery,
	 	takeLatest, all } 				from 'redux-saga/effects'

import loadPhotoSaga 					from './photoSaga'
import loadPostSaga 					from './postSaga'
import { commentsSaga, 
	sideCommentsSaga } 					from './commentSaga'
import { secretsSaga, questionsSaga } 	from './questionSaga'
import { suggestionsSaga }				from './RelationShipSaga'
import diarySaga 						from './diarySaga'
import { UserSaga, UsersSaga } 			from './usersSaga'
import invitationSaga					from './invitationSaga'

/*
Alternatively you may use takeLatest.
Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
dispatched while a fetch is already pending, that pending fetch is cancelled
and only the latest one will be run.
*/
export default function* rootSaga() {
	yield all([
			fork(diarySaga),
			fork(secretsSaga),
			fork(loadPostSaga),
			fork(loadPhotoSaga),
			fork(commentsSaga),
			fork(questionsSaga),
			fork(sideCommentsSaga),
			fork(suggestionsSaga),
			fork(UserSaga),
			fork(UsersSaga)
		])
}