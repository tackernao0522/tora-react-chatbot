import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from "./config";

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
