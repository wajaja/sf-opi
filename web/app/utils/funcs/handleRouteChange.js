import {
	App as AppActions,
	User as UserActions,
	Home as HomeActions,
	Users as UsersActions,
	Posts as PostsActions,
	Photo as PhotoActions,
	Photos as PhotosActions,
	Search as SearchActions,
	Message as MessageActions,
	Profiles as ProfilesActions,
} 									from '../../actions'

/**
 * handleRouteChange
 * @param dispatch
 * @param history
 * @param location
 */
export default function handleRouteChange(dispatch, history, location) {
    const pathname = location.pathname,
    pathnameArr = pathname.split('/');

    if(pathnameArr.length === 2) {
        const username = pathnameArr[1].split('?')[0];
        dispatch(ProfilesActions.loadProfile(username));
    }
    //~ apply strict
    if(~pathname.indexOf('/confirmed/')) {
    	console.log('confirmed')
    } else if(~pathname.indexOf('/messages/')) {
    	dispatch(MessageActions.inbox());
    } else if(~pathname.indexOf('/posts/')) {
    	console.log('posts')
    } else {
    	console.log('not found')
    }
}