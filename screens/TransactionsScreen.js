import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import ListItem from '../components/list/TransactionItem';
import { Store } from '../context/Store';

const ListHeader = ({ title, principal }) => (
  <React.Fragment>
    <View style={styles.titleWrapper}>
      <Text style={styles.title}>{title}</Text>
      {principal !== null ? (
        <Text style={styles.subtitle}>
          ${principal.toLocaleString('en-US', { currency: 'USD' })}
        </Text>
      ) : null}
    </View>
    <View style={styles.divider} />
  </React.Fragment>
);

const TransactionsScreen = () => {
  const { state, dispatch } = useContext(Store);
  const [darkMode, setDarkMode] = useState(state.darkMode);
  const colorScheme = useColorScheme();
  const data = [
    {
      id: 'ok2qj3n',
      name: 'Bitcoin',
      symbol: 'btc',
      pricePerCoin: 23504,
      coinAmount: -0.2,
      date: 'Jan 13, 2021',
    },
    {
      id: 'n34la',
      name: 'Bitcoin',
      symbol: 'btc',
      pricePerCoin: 13504,
      coinAmount: 1,
      date: 'Jan 1, 2021',
    },
    {
      id: 'nl4q',
      name: 'Ethereum',
      symbol: 'eth',
      pricePerCoin: 1203,
      coinAmount: 0.8,
      date: 'Jan 3, 2021',
    },
  ];
  useEffect(() => {
    if (colorScheme === 'dark') {
      dispatch({ type: 'SET_DARK_MODE', payload: true });
    } else {
      dispatch({ type: 'SET_DARK_MODE', payload: false });
    }
  }, []);
  return (
    <View>
      <SafeAreaView style={darkMode ? styles.darkContainer : lightContainer}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={({ item }) => (
            <ListItem
              name={item.name}
              symbol={item.symbol}
              type={item.type}
              currentPrice={item.pricePerCoin}
              date={item.date}
              coinAmount={item.coinAmount}
            />
          )}
          ListHeaderComponent={
            <ListHeader title="Transaction History" principal={null} />
          }
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  lightContainer: {
    width: '100%',
    backgroundColor: '#fefefe',
  },
  darkContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#21262d',
  },
  titleWrapper: {
    marginTop: 16,
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: 'steelblue',
    fontSize: 24,
  },
  subtitle: {
    fontWeight: 'bold',
    color: 'steelblue',
    fontSize: 18,
  },
  menuIcon: {
    fontSize: 24,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#A9ABB1',
    marginTop: 16,
  },
});
