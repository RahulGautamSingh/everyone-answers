import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_82ovSKB3E2PkfIR5IsQKnX5AuAgtd6Q",
  authDomain: "demoliveclass-e1696.firebaseapp.com",
  projectId: "demoliveclass-e1696",
  storageBucket: "demoliveclass-e1696.appspot.com",
  messagingSenderId: "394001548959",
  appId: "1:394001548959:web:3a2a54079f248f844d44aa"
};


firebase.initializeApp(firebaseConfig)


export const provider = new firebase.auth.GoogleAuthProvider();
export const  db = firebase.firestore();