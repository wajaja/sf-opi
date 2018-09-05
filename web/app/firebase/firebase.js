import * as firebase from 'firebase';

const prodConfig = {
  	apiKey: "AIzaSyAlorCgK7NTTKQUB-jmGpntxKYfnIJNtbQ",
    authDomain: "opinion-5f379.firebaseapp.com",
    databaseURL: "https://opinion-5f379.firebaseio.com",
    projectId: "opinion-5f379",
    storageBucket: "opinion-5f379.appspot.com",
    messagingSenderId: "335779001608"
};

const devConfig = {
  	apiKey: "AIzaSyAlorCgK7NTTKQUB-jmGpntxKYfnIJNtbQ",
    authDomain: "opinion-5f379.firebaseapp.com",
    databaseURL: "https://opinion-5f379.firebaseio.com",
    projectId: "opinion-5f379",
    storageBucket: "opinion-5f379.appspot.com",
    messagingSenderId: "335779001608"
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

if (!firebase.apps.length) {
  	firebase.initializeApp(config);
}


const auth = firebase.auth();
const db = firebase.database();

export { 
  prodConfig,
  devConfig,
	auth,
	db,
};