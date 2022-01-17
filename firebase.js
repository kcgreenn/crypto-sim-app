// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
// import { state, dispatch } from './context/Store';
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

// Login to existing user account
const loginUser = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userData = await getUserData(user.uid, email);
    return userData;
  } catch {
    (error) => console.log(error);
  }
};

// Create new user account
const registerUser = async (username, email, password) => {
  console.log('outside try block');
  // try {
  console.log('inside registerUser - ', username);
  // Create new user account
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  console.log('after create user');
  // Create profile with default values
  const defaultPrincipal = 10000;
  const defaultCurrency = 'USD';
  // Create user document in firestore
  await setDoc(doc(db, 'users', user.uid), {
    name: username,
    email: email,
    principal: defaultPrincipal,
    domesticCurrency: defaultCurrency,
    assets: [],
    transactions: [],
  });
  const userData = await getUserData(user.uid);
  return userData;
  // } catch {
  //   (error) => console.log(error);
  // }
};

// Get user data
const getUserData = async (uid) => {
  try {
    // Get user info from firebase
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        name: data.name,
        uid: uid,
        principal: data.principal,
        domesticCurrency: data.domesticCurrency,
        assets: data.assets,
        transactions: data.transactions,
      };
    }
  } catch {
    (error) => {
      console.log(error);
    };
  }
};
const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch {
    (error) => console.log(error);
  }

  // .then((v) => {
  //   console.log('logged out');
  // })
  // .catch((error) => console.log(error.message));
};

// Set the domestic currency of the user
const setDomesticCurrency = async (uid, newCurrency) => {
  try {
    const updatedUser = await setDoc(
      doc(db, 'users', uid),
      {
        domesticCurrency: newCurrency,
      },
      { merge: true }
    );

    return updatedUser;
  } catch {
    (error) => {
      console.log(error);
    };
  }
};

// Add transaction to transactions list
const recordTransaction = async (
  uid,
  transactionList,
  newPrincipal,
  updatedAssets
) => {
  try {
    console.log('inside recordTransaction');
    const updatedUser = await setDoc(
      doc(db, 'users', uid),
      {
        principal: newPrincipal,
        transactions: transactionList,
        assets: updatedAssets,
      },
      { merge: true }
    );
    return updatedUser;
  } catch {
    (error) => {
      console.log(error);
    };
  }
};

// Update assets list
const updateAssets = async (uid, assetList, newAsset) => {
  try {
    console.log(assetList.includes((asset) => asset.name === newAsset.name));
    // TODO: update assets instead of transactions
    // const updatedUser = await setDoc(
    //   doc(db, 'users', uid),
    //   { transactions: updatedTransactionList },
    //   { merge: true }
    // );
  } catch {
    (error) => {
      console.log(error);
    };
  }
};

export {
  app,
  auth,
  db,
  usersRef,
  loginUser,
  registerUser,
  getUserData,
  logoutUser,
  setDomesticCurrency,
  recordTransaction,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
};
