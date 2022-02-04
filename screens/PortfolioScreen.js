import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import UserMarketList from '../components/UserMarketList';
import { getUserMarketData } from '../services/cryptoService';
import { Store } from '../context/Store';
import { getUserData } from '../firebase';

const PortfolioScreen = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;

  useEffect(() => {
    const getUserAssets = async () => {
      try {
        const { assets } = await getUserData(state.uid);
        dispatch({ type: 'SET_ASSETS', payload: assets });
      } catch (err) {
        console.log(err);
      }
    };

    const fetchMarketData = async () => {
      try {
        if (state.assets.length > 0) {
          const filterredAssets = state?.assets?.filter(
            (asset) => asset.amount > 0.0
          );
          const assetIds = filterredAssets.map((asset) => asset.id);

          const marketData = await getUserMarketData(
            assetIds,
            state.domesticCurrency
          );

          setData(marketData);
        }
      } catch {
        (error) => {
          console.log(error);
        };
      }
    };
    const interval = setInterval(() => {
      fetchMarketData();
    }, 300000);
    fetchMarketData();

    return () => clearInterval(interval);
  }, [state]);

  if (state?.assets?.length === 0)
    return (
      <View style={darkMode ? styles.darkContainer : styles.lightContainer}>
        <Text
          style={{
            fontSize: 48,
            textAlign: 'center',
            paddingHorizontal: 18,
            color: darkMode ? '#dedede' : '#3e3e3e',
          }}
        >
          You have not bought any coins yet.
        </Text>
      </View>
    );

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
        assets={state.assets.filter((asset) => asset.amount > 0.0)}
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
