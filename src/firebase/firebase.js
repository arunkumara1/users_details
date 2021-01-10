import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3ioP1_BcL5boC2wOtGZF4SbFtZauBvPk",
  authDomain: "user-details-app-ceb54.firebaseapp.com",
  databaseURL: "https://user-details-app-ceb54.firebaseio.com",
  projectId: "user-details-app-ceb54",
  storageBucket: "user-details-app-ceb54.appspot.com",
  messagingSenderId: "964252695431",
  appId: "1:964252695431:web:1a342bc4164ae35c997122",
  measurementId: "G-0S2E82189B",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export default db;
