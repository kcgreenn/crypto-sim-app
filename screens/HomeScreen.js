import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';

import MarketList from '../components/MarketList';
import { Store } from '../context/Store';
import { getMarketData } from '../services/cryptoService';
import ErrorBoundary from 'react-native-error-boundary';

const errorHandler = (error, stackTrace) => {
  throw error;
};

const CustomFallback = ({ error, resetError }) => {
  <View>
    <Text>Something went wrong!</Text>
    <Text>{error.toString()}</Text>
    <Button onPress={resetError} title={Reset} />
  </View>;
};

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
    <ErrorBoundary onError={errorHandler} FallbackComponent={CustomFallback}>
      <View style={styles.container}>
        <MarketList title="Market Prices" data={data} principal={null} />
      </View>
    </ErrorBoundary>
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
