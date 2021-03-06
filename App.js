import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import OptionsScreen from './screens/OptionsScreen';
import PortfolioScreen from './screens/PortfolioScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from './firebase';
import RegisterScreen from './screens/RegisterScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import { Store, StoreProvider } from './context/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppEntry from './components/AppEntry';
import * as Sentry from 'sentry-expo';

const Tabs = createMaterialBottomTabNavigator();

const Stack = createNativeStackNavigator();

Sentry.init({
  dsn: 'https://62f6f09f21644bd4bd896b65241b4fd5@o302933.ingest.sentry.io/6191096',
  enableInExpoDevelopment: true,
  debug: true,
});

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on component unmount
  }, []);

  if (initializing) return null;

  return (
    <StoreProvider>
      <AppEntry />
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
