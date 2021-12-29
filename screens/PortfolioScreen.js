import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase';
import UserMarketList from '../components/UserMarketList';
import { getUserMarketData } from '../services/cryptoService';

const PortfolioScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      const marketData = await getUserMarketData();
      setData(marketData);
    };
    fetchMarketData();
    // console.log(data[0].name);
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
      <View style={styles.container}>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
