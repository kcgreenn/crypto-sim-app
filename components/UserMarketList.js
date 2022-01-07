import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import UserListItem from './list/UserListItem';
import Chart from './Chart';
import { getMarketData } from '../services/cryptoService';
import { ActivityIndicator } from 'react-native-paper';
import { Store } from '../context/Store';

export const ListHeader = ({ title, totalValue, principal }) => (
  <React.Fragment>
    <View style={styles.titleWrapper}>
      {totalValue !== null ? (
        <React.Fragment>
          <Text style={styles.title}>Total Assets</Text>
          <Text style={styles.subtitle}>
            ${totalValue.toLocaleString('en-US', { currency: 'USD' })}
          </Text>
        </React.Fragment>
      ) : null}
    </View>
    <View style={styles.titleWrapper}>
      <Text style={styles.subtitle}>Cash&nbsp;&nbsp;&nbsp;</Text>
      {principal ? (
        <Text style={styles.subtitle}>
          ${principal.toLocaleString('en-US', { currency: 'USD' })}
        </Text>
      ) : null}
    </View>
    <View style={styles.divider} />
  </React.Fragment>
);

const UserMarketList = ({ title, data, assets, principal }) => {
  const [selectedCoinData, setSelectedCoinData] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['55%'], []);
  const handleSheetChanges = () => {};

  const calcTotalValue = () => {
    let tempTotalValue = 0;
    assets?.forEach((asset, index) => {
      tempTotalValue += data[index].current_price * asset.amount;
    });
    tempTotalValue += principal;
    setTotalValue(tempTotalValue);
  };

  const openModal = (item) => {
    setSelectedCoinData(item);
    bottomSheetModalRef.current.present();
  };
  if (data === undefined) {
    return <ActivityIndicator />;
  }
  useEffect(() => {
    calcTotalValue();
  }, [assets]);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={darkMode ? styles.darkContainer : styles.lightContainer}
      >
        <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={({ item }) => (
            <UserListItem
              name={item.name}
              symbol={item.symbol}
              quantity={
                assets.find((element) => element.name === item.name).amount
              }
              currentPrice={item.current_price}
              priceChangePercentage7d={
                item.price_change_percentage_7d_in_currency
              }
              logoUrl={item.image}
              onPress={() => openModal(item)}
            />
          )}
          ListHeaderComponent={
            <ListHeader
              title={title}
              totalValue={totalValue}
              totalValue={1}
              principal={principal}
            />
          }
        />
        <StatusBar style="auto" />
      </SafeAreaView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        style={styles.bottomSheet}
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
        <View style={styles.tradeView}>
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

export default UserMarketList;
