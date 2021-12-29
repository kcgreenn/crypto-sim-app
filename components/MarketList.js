import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import ListItem from './list/ListItem';
import Chart from './Chart';
import { getMarketData } from '../services/cryptoService';
import { ActivityIndicator } from 'react-native-paper';
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

const MarketList = ({ title, data, principal }) => {
  const [selectedCoinData, setSelectedCoinData] = useState(null);

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['55%'], []);

  const handleSheetChanges = () => {};

  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;

  const openModal = (item) => {
    setSelectedCoinData(item);
    bottomSheetModalRef.current.present();
  };
  if (data === undefined) {
    return <ActivityIndicator />;
  }
  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={darkMode ? styles.darkContainer : styles.lightContainer}
      >
        <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={({ item }) => (
            <ListItem
              name={item.name}
              symbol={item.symbol}
              currentPrice={item.current_price}
              priceChangePercentage7d={
                item.price_change_percentage_7d_in_currency
              }
              logoUrl={item.image}
              onPress={() => openModal(item)}
            />
          )}
          ListHeaderComponent={
            <ListHeader title={title} principal={principal} />
          }
        />
        <StatusBar style="auto" />
      </SafeAreaView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        style={[darkMode ? styles.darkBottomSheet : styles.lightBottomSheet]}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        {selectedCoinData ? (
          <Chart
            currentPrice={selectedCoinData.current_price}
            logoUrl={selectedCoinData.image}
            name={selectedCoinData.name}
            symbol={selectedCoinData.symbol}
            priceChangePercentage7d={
              selectedCoinData.price_change_percentage_7d_in_currency
            }
            sparkline={selectedCoinData.sparkline_in_7d.price}
          />
        ) : null}
        <View style={darkMode ? styles.darkTradeView : lightTradeView}>
          <TouchableOpacity style={styles.tradeBtn}>
            <Text style={styles.tradeText}>Trade</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fefefe',
  },
  darkContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#21262d',
    color: '#c9b08d',
  },
  darkBottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#21262d',
  },
  lightBottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#3e3e3e',
  },
  darkTradeView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#21262d',
  },
  lightTradeView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fefefe',
  },
  tradeBtn: {
    backgroundColor: '#0251fd',
    width: '90%',
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  tradeText: {
    color: '#fefefe',
    fontSize: 18,
  },
});

export default MarketList;
