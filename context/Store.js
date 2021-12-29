import React, { createContext, useEffect, useReducer, useState } from 'react';
import { useColorScheme } from 'react-native';

export const Store = createContext();

const initialState = {
  darkMode: false,
  name: '',
  email: '',
  principal: 0,
  domesticCurrency: 'USD',
  assets: [],
  transactions: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGOUT':
      return {
        ...state,
        name: '',
        email: '',
        principal: 0,
        domesticCurrency: 'USD',
        assets: [],
        transactions: [],
      };
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_USER':
      return {
        ...state,
        name: action.payload.name,
        email: action.payload.email,
      };
    case 'SET_DOMESTIC_CURRENCY':
      // TODO: Save to firestore
      return { ...state, domesticCurrency: action.payload };
    case 'SET_PRINCIPAL':
      // TODO: Save to firestore
      return { ...state, principal: action.payload };
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
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
