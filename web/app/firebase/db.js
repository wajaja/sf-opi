import { db } from './firebase';

// User API
// it is stored on the users/${id} resource path. 
export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

// users are retrieved from the general user’s 
// entity resource path. The function will return all users
export const onceGetUsers = () =>
  db.ref('users').once('value');