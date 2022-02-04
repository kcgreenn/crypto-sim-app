import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import MarketList from '../components/MarketList';
import { Store } from '../context/Store';
import { getMarketData } from '../services/cryptoService';

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    const fetchMarketData = async () => {
      const marketData = await getMarketData(state.domesticCurrency);
      setData(marketData);
    };
    const interval = setInterval(() => {
      fetchMarketData();
    }, 300000);
    fetchMarketData();
    return () => clearInterval(interval);
  }, [state]);

  if (data.length === 0)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="steelblue" />
      </View>
    );

  return (
    <View style={styles.container}>
      <MarketList title="Market Prices" data={data} principal={null} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dedede',
  },
});
