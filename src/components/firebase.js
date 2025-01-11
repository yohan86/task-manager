import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider  } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';


const firebaseConfig = {

    apiKey: "AIzaSyD8ZY8HwZTBcwpE6WRrOXNaexwLl1s2d9o",
  
    authDomain: "task-manager-a30db.firebaseapp.com",
  
    projectId: "task-manager-a30db",
  
    storageBucket: "task-manager-a30db.firebasestorage.app",
  
    messagingSenderId: "370629483288",
  
    appId: "1:370629483288:web:372b49d1d204305961dc6d"
  
  };
  
  
  // Initialize Firebase
  
  const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


export {auth, db, GoogleAuthProvider };