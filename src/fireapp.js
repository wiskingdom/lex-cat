import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import firebaseConfig from './.firebase.config.json';

export default firebase.initializeApp(firebaseConfig);
