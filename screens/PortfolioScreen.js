import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase';
import UserMarketList from '../components/UserMarketList';
import { getUserMarketData } from '../services/cryptoService';
import { Store } from '../context/Store';

const PortfolioScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(Store);
  const colorScheme = useColorScheme();
  const { darkMode } = state;

  useEffect(() => {
    const fetchMarketData = async () => {
      const marketData = await getUserMarketData();
      setData(marketData);
    };
    if (colorScheme === 'dark') {
      dispatch({ type: 'SET_DARK_MODE', payload: true });
    } else {
      dispatch({ type: 'SET_DARK_MODE', payload: false });
    }
    fetchMarketData();
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(navigation.replace('Login'))
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  if (data.length === 0)
    return (
      <View style={darkMode ? styles.darkContainer : styles.lightContainer}>
        <ActivityIndicator size="large" color="steelblue" />
      </View>
    );

  return (
    <View style={styles.container}>
      <UserMarketList title="Market Prices" data={data} principal={null} />
    </View>
  );
};

export default PortfolioScreen;

const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21262d',
  },
  lightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefefe',
  },
});
