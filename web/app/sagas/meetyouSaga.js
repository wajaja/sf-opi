import { call, put, fork, takeEvery } from 'redux-saga/effects';

import * as unsplash from '../routes/social/MeetYou/utils/unsplash';
import {selectImage} from '../actions/social/MeetYou';

function* initImagesSaga() {
    const images = yield call(unsplash.getPopularImages);
    yield put({ type: 'RECEIVE_IMAGES', images });
    yield put(selectImage(images[0]));
}

function* getPopularImagesSaga() {
    const images = yield call(unsplash.getPopularImages);
    yield put({ type: 'RECEIVE_IMAGES', images });
}

function* loadBackgrounds() {
     const images = yield call(unsplash.loadBackgrounds);
    yield put({ type: 'LOAD_BACKGROUNDS_RESPONSE', images });
}

function* searchImagesSaga({ query }) {
    const images = yield call(unsplash.searchImages, query);
    yield put({ type: 'RECEIVE_IMAGES', images });
}

export default function* rootSaga() {
    yield fork(initImagesSaga);
    yield fork(takeEvery, 'SEARCH_IMAGES', searchImagesSaga);
    yield fork(takeEvery, 'RESET_SEARCH', getPopularImagesSaga);
    yield fork(takeEvery, 'LOAD_BACKGROUNDS', loadBackgrounds)
}
