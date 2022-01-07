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
  const loggedInUser = await signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  const userData = getUserData;
  return userData;
};
// Create new user account
const registerUser = (username, email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const { user } = userCredential;
      const defaultPrincipal = 10000;
      const defaultCurrency = 'USD';
      // Create user document in firestore
      const docRef = await setDoc(doc(db, 'users', user.uid), {
        name: username,
        email: email,
        principal: defaultPrincipal,
        domesticCurrency: defaultCurrency,
        assets: [],
        transactions: [],
      });
      // dispatch({
      //   type: 'SET_USER',
      //   payload: { name: username, email: email, uid: user.uid },
      // });
      // dispatch({ type: 'SET_PRINCIPAL', payload: defaultPrincipal });
      // dispatch({ type: 'SET_DOMESTIC_CURRENCY', payload: defaultCurrency });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

// Get user data
const getUserData = async (uid) => {
  try {
    // Get user info from firebase
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    // console.log('docsnap - ', docSnap);
    if (docSnap.exists()) {
      //   console.log('docSnap exists - ', docSnap.data());
      const data = docSnap.data();
      return {
        name: data.name,
        email: email,
        uid: loggedInUser.uid,
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
const logoutUser = () => {
  signOut(auth)
    .then((v) => {
      console.log('logged out');
    })
    .catch((error) => console.log(error.message));
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
  } catch {
    (error) => {
      console.log(error);
    };
  }

  return updatedUser;
};

// Update the account balance
const updateAccountBalance = async (uid, newBalance) => {
  try {
    const updatedUser = await setDoc(
      doc(db, 'users', uid),
      { balance: newBalance },
      { merge: true }
    );
  } catch {
    (error) => {
      console.log(error);
    };
  }
  return updatedUser;
};

// Add transaction to transactions list
const recordTransaction = async (uid, updatedTransactionList) => {
  try {
    const updatedUser = await setDoc(
      doc(db, 'users', uid),
      { transactions: updatedTransactionList },
      { merge: true }
    );
  } catch {
    (error) => {
      console.log(error);
    };
  }
};

// Update assets list
const updateAssets = async (uid, updatedAsset) => {
  try {
    // TODO: update assets instead of transactions
    const updatedUser = await setDoc(
      doc(db, 'users', uid),
      { transactions: updatedTransactionList },
      { merge: true }
    );
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
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
};
