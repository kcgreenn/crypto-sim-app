import React, { createContext, useEffect, useReducer } from 'react';
import { useColorScheme } from 'react-native';
import { loginUser, logoutUser, registerUser } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Store = createContext();

// Function to handle async dispatch calls
const wrapAsync = (dispatch) => {
  return function (action) {
    if (action.instanceOf(Function)) {
      return action(dispatch);
    }
    return dispatch(action);
  };
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGOUT':
      logoutUser();
      return {
        ...state,
        isAuth: false,
        name: '',
        email: '',
        uid: '',
        principal: 0,
        domesticCurrency: 'USD',
        assets: [],
        transactions: [],
      };
    case 'LOGIN':
      const {
        name,
        email,
        uid,
        principal,
        domesticCurrency,
        assets,
        transactions,
      } = action.payload;
      return {
        ...state,
        isAuth: true,
        name,
        email,
        uid,
        principal,
        domesticCurrency,
        assets,
        transactions,
      };
    case 'REGISTER':
      // TODO: Register with firebase and set local user info
      registerUser(
        action.payload.username,
        action.payload.email,
        action.payload.password
      );
      return state;
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_USER':
      return {
        name: action.payload.name,
        email: action.payload.email,
        uid: action.payload.uid,
        principal: action.payload.principal,
        domesticCurrency: action.payload.domesticCurrency,
        assets: action.payload.assets,
        transactions: action.payload.transactions,
      };
    case 'SET_DOMESTIC_CURRENCY':
      // TODO: Save to firestore
      return { ...state, domesticCurrency: action.payload };
    case 'LOAD_ACCOUNT_INFO':
      // TODO: LOAD Domestic Currency, Assets, Transactions, Principal
      return state;
    case 'SET_PRINCIPAL':
      // TODO: Save to firestore
      const newPrincipal = state.principal + action.payload;
      return { ...state, principal: newPrincipal };
    case 'LOAD_ASSETS':
      return { ...state, assets: action.payload };
    case 'UPDATE_ASSETS':
      const newAsset = action.payload;
      // find if asset is already in asset list
      const existAsset = state.assets.find(
        (item) => item.name === updatedAsset.name
      );
      const assetList = existAsset
        ? state.assets.map((item) =>
            item.name === existAsset.name ? newAsset : item
          )
        : [...state.assets, newAsset];
      // TODO: Save to firestore
      return { ...state, assets: assetList };
    case 'LOAD_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'UPDATE_TRANSACTIONS':
      const newTransaction = action.payload;
      const updatedTransactions = state.transactions.push(newTransaction);
      // TODO: Save to firestore
      return { ...state, updatedTransactions };
    case 'DELETE_ACCOUNT':
    // TODO: delete account from firebase
    default:
      return state;
  }
};

export function StoreProvider(props) {
  const getLocalInfo = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    return JSON.parse(userInfo);
  };

  const colorScheme = useColorScheme();
  const initialState = {
    darkMode: colorScheme === 'dark',
    isAuth: false,
    name: '',
    email: '',
    uid: '',
    principal: 0,
    domesticCurrency: 'USD',
    assets: [],
    transactions: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  useEffect(async () => {}, [state, value]);

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
