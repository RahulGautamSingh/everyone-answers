import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCbWWlpZmzXKK9tsCJTtEnxvn_NBygAWAU",
    authDomain: "liveclass-bdf1f.firebaseapp.com",
    projectId: "liveclass-bdf1f",
    storageBucket: "liveclass-bdf1f.appspot.com",
    messagingSenderId: "562496047019",
    appId: "1:562496047019:web:dfe52f113dad338dc634ee"
  };


firebase.initializeApp(firebaseConfig)


export const provider = new firebase.auth.GoogleAuthProvider();
export const  db = firebase.firestore();