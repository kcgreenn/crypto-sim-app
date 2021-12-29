// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAfcEWYj12J7Y_-7pghoeqeTT8_JJ520fE',
  authDomain: 'crypto-market-sim.firebaseapp.com',
  projectId: 'crypto-market-sim',
  storageBucket: 'crypto-market-sim.appspot.com',
  messagingSenderId: '527984649555',
  appId: '1:527984649555:web:5bd8ecfd9da11db3ad2da6',
  measurementId: 'G-PH36ED6LQP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

const db = getFirestore();

const usersRef = collection(db, 'users');

export { app, auth, collection, db, usersRef, doc, addDoc, setDoc, getDoc };
