import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ListItem from '../components/list/ListItem';

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
  const data = [
    {
      id: 'ok2qj3n',
      name: 'Bitcoin',
      symbol: 'btc',
      pricePerCoin: 23504,
      type: 'sell',
      date: 'Jan 13, 2021',
    },
    {
      id: 'n34la',
      name: 'Bitcoin',
      symbol: 'btc',
      pricePerCoin: 13504,
      type: 'buy',
      date: 'Jan 1, 2021',
    },
    {
      id: 'nl4q',
      name: 'Ethereum',
      symbol: 'eth',
      pricePerCoin: 1203,
      type: 'buy',
      date: 'Jan 3, 2021',
    },
  ];
  return (
    <View>
      <SafeAreaView style={styles.container}>
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
              //   logoUrl={item.image}
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
  container: {
    // flex: 1,
    width: '95%',
    marginLeft: '2.5%',
    backgroundColor: '#fff',
  },
  contentContainer: {},
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
