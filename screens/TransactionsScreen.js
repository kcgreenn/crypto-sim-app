import React, { useContext, useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TransactionItem from '../components/list/TransactionItem';
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
  const { darkMode } = state;
  const data = state.transactions.sort((a, b) => {
    a.id - b.id;
  });

  useEffect(() => {}, [state.transactions]);

  return (
    <View>
      <SafeAreaView
        style={darkMode ? styles.darkContainer : styles.lightContainer}
      >
        <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={({ item }) => (
            <TransactionItem
              boughtCoinName={item.boughtCoinName}
              dollarAmount={item.dollarAmount}
              soldCoinName={item.soldCoinName}
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
