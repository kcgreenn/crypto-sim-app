import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase';
import MarketList from '../components/MarketList';
import { getMarketData } from '../services/cryptoService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      const marketData = await getMarketData();
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
    // width: '100%',
  },
  // button: {
  //   // backgroundColor: '#0782F9',
  //   backgroundColor: 'steelblue',
  //   width: '60%',
  //   padding: 15,
  //   borderRadius: 10,
  //   alignItems: 'center',
  //   marginTop: 24,
  // },
  // buttonText: {
  //   color: 'white',
  //   fontWeight: '700',
  //   fontSize: 16,
  // },
});

{
  /* <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity> */
}