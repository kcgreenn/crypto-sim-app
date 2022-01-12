import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserMarketList from '../components/UserMarketList';
import { getUserMarketData } from '../services/cryptoService';
import { Store } from '../context/Store';
import { getUserData } from '../firebase';

const PortfolioScreen = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;

  useEffect(() => {
    const fetchMarketData = async () => {
      const assetNames = state.assets?.map((asset) => asset.name.toLowerCase());
      try {
        const marketData = await getUserMarketData(
          assetNames,
          state.domesticCurrency
        );
        setData(marketData);
      } catch {
        (error) => {
          console.log(error);
        };
      }
    };
    fetchMarketData();
  }, [state]);

  if (data.length === 0)
    return (
      <View style={darkMode ? styles.darkContainer : styles.lightContainer}>
        <ActivityIndicator size="large" color="steelblue" />
      </View>
    );

  return (
    <View style={darkMode ? styles.darkContainer : styles.lightContainer}>
      <UserMarketList
        title="Total Assets"
        data={data}
        principal={state.principal}
        assets={state.assets}
      />
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
