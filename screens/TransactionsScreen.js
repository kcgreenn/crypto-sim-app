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
  <View style={styles.titleWrapper}>
    <Text style={styles.title}>{title}</Text>
    {principal !== null ? (
      <Text style={styles.subtitle}>
        ${principal.toLocaleString('en-US', { currency: 'USD' })}
      </Text>
    ) : null}
  </View>
);

const TransactionsScreen = () => {
  const { state, dispatch } = useContext(Store);
  const data = state.transactions.sort((a, b) => b.id - a.id);

  useEffect(() => {}, [state]);

  if (state.transactions.length === 0) {
    return (
      <View
        style={state.darkMode ? styles.darkContainer : styles.lightContainer}
      >
        <Text
          style={{
            fontSize: 48,
            textAlign: 'center',
            paddingHorizontal: 18,
            color: state.darkMode ? '#dedede' : '#3e3e3e',
          }}
        >
          You have not made any transactions yet.
        </Text>
      </View>
    );
  }
  return (
    <SafeAreaView
      style={state.darkMode ? styles.darkContainer : styles.lightContainer}
    >
      <FlatList
        keyExtractor={(item) => item.id}
        data={data}
        style={{
          width: '100%',
        }}
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
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  darkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21262d',
  },
  lightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fefefe',
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
