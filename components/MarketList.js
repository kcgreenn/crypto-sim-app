import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CurrencyInput from 'react-native-currency-input';

import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListItem from './list/ListItem';
import Chart from './Chart';
import { ActivityIndicator } from 'react-native-paper';
import { Store } from '../context/Store';
import { recordTransaction, updateAccountBalance } from '../firebase';
import { createDate } from '../services/dateService';

const ListHeader = ({ title, principal, handleSearchInput }) => (
  <React.Fragment>
    <View style={styles.titleWrapper}>
      <Text style={styles.title}>{title}</Text>
      <Text style={{ color: 'gray' }}>7d</Text>
      {principal !== null ? (
        <Text style={styles.subtitle}>
          ${principal.toLocaleString('en-US', { currency: 'USD' })}
        </Text>
      ) : null}
    </View>
    <View style={{ flexDirection: 'row' }}>
      <Text style={{ paddingLeft: 18, width: '15%', marginTop: 4 }}>
        <MaterialCommunityIcons name="magnify" color={'#6e6e6e'} size={26} />
      </Text>
      <TextInput
        onChangeText={handleSearchInput}
        style={{
          paddingLeft: 8,
          marginTop: 4,
          height: 24,
          fontSize: 24,
          width: '80%',
          color: '#9e9e9e',
          borderColor: '#3e3e3e',
          borderRadius: 10,
          // borderWidth: 1,
        }}
      ></TextInput>
    </View>
    <View style={styles.divider} />
  </React.Fragment>
);

const MarketList = ({ title, data, principal }) => {
  const [selectedCoinData, setSelectedCoinData] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const [btmSheetHeight, setBtmSheetHeight] = useState('0%');
  const snapPoints = useMemo(() => ['58%'], []);
  const handleSheetChanges = () => {};
  const { state, dispatch } = useContext(Store);
  const [tradeModalVisible, setTradeModalVisible] = useState(false);
  const { darkMode } = state;
  const [tradeAmount, setTradeAmount] = useState(0);
  const [tradeCoinAmount, setTradeCoinAmount] = useState(0);
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  const openBottomModal = (item) => {
    try {
      setSelectedCoinData(item);
      bottomSheetModalRef.current.present();
    } catch (err) {
      throw err;
    }
  };

  const openTradeModal = () => {
    setTradeModalVisible(true);
  };

  const handleDollarInput = (value) => {
    setTradeAmount(value);
    setTradeCoinAmount(value / selectedCoinData.current_price);
  };
  const handleCoinInput = (value) => {
    setTradeCoinAmount(value);
    setTradeAmount(value * selectedCoinData.current_price);
  };

  const handleBuyPress = async () => {
    if (tradeAmount == 0.0 || tradeCoinAmount == 0.0) {
      return;
    }
    if (tradeAmount > state.principal) {
      Alert.alert('You do not have enough money for this trade.');
      return;
    }
    const formattedToday = createDate();
    // Collect transaction data
    const newTransaction = {
      boughtCoinName: selectedCoinData.name,
      coinAmount: tradeCoinAmount,
      date: formattedToday,
      dollarAmount: tradeAmount,
      soldCoinName: state.domesticCurrency,
      id: Date.now(),
    };
    // Subtract from principal
    const newBalance = state.principal - tradeAmount;
    // Update asset list
    const updatedAssetsList = state.assets;
    if (state.assets.find((asset) => asset.name === selectedCoinData.name)) {
      const updatedElementIndex = state.assets.findIndex(
        (asset) => asset.name === selectedCoinData.name
      );
      updatedAssetsList[updatedElementIndex].amount += tradeCoinAmount;
    } else {
      updatedAssetsList.push({
        amount: tradeCoinAmount,
        name: selectedCoinData.name,
        id: selectedCoinData.id,
        symbol: selectedCoinData.symbol,
      });
    }
    // Update transaction list
    const updatedTransactions = state.transactions;
    updatedTransactions.push(newTransaction);
    // Send transaction to firebase
    const updatedAccountInfo = await recordTransaction(
      state.uid,
      updatedTransactions,
      newBalance,
      updatedAssetsList
    );
    // Save account info to state
    dispatch({
      type: 'RECORD_TRANSACTION',
      payload: {
        transactions: updatedTransactions,
        principal: newBalance,
        assets: updatedAssetsList,
      },
    });
    // save account info to local storage
    await AsyncStorage.setItem('userInfo', JSON.stringify(state));
    // Hide Modal and clear inputs
    setTradeAmount(0);
    setTradeCoinAmount(0);
    setTradeModalVisible(!tradeModalVisible);
    setTransactionSuccess(true);
    Alert.alert('Transaction Successful');
  };

  const handleSellPress = async () => {
    if (tradeAmount == 0.0 || tradeCoinAmount == 0.0) {
      return;
    }
    if (
      state.assets.find((asset) => asset.symbol === selectedCoinData.symbol)
    ) {
      if (
        tradeCoinAmount >
        state.assets.find((asset) => asset.symbol === selectedCoinData.symbol)
          .amount
      ) {
        Alert.alert('You do not own enough of this coin for this trade.');
        return;
      }
    }
    const formattedToday = createDate();
    // Collect transaction data
    const newTransaction = {
      boughtCoinName: state.domesticCurrency,
      coinAmount: tradeCoinAmount,
      date: formattedToday,
      dollarAmount: tradeAmount,
      soldCoinName: selectedCoinData.name,
      id: Date.now(),
    };
    // Subtract from principal
    const newBalance = state.principal + tradeAmount;
    // Update asset list
    let updatedAssetsList = state.assets;

    if (state.assets.find((asset) => asset.name === selectedCoinData.name)) {
      const updatedElementIndex = state.assets.findIndex(
        (asset) => asset.name === selectedCoinData.name
      );
      updatedAssetsList[updatedElementIndex].amount -= tradeCoinAmount;
      if (updatedAssetsList[updatedElementIndex].amount === 0.0) {
        updatedAssetsList = updatedAssetsList.filter(
          (asset) => asset.symbol !== selectedCoinData.symbol
        );
      }
    }
    // Update transaction list
    const updatedTransactions = state.transactions;
    updatedTransactions.push(newTransaction);
    // Send transaction to firebase
    const updatedAccountInfo = await recordTransaction(
      state.uid,
      updatedTransactions,
      newBalance,
      updatedAssetsList
    );
    // Save account info to state
    dispatch({
      type: 'RECORD_TRANSACTION',
      payload: {
        transactions: updatedTransactions,
        principal: newBalance,
        assets: updatedAssetsList,
      },
    });
    // save account info to local storage
    await AsyncStorage.setItem('userInfo', JSON.stringify(state));
    // Hide Modal and clear inputs
    setTradeAmount(0);
    setTradeCoinAmount(0);
    setTradeModalVisible(!tradeModalVisible);
    setTransactionSuccess(true);
    Alert.alert('Transaction Successful');
  };

  const handleSellMaxPress = async () => {
    if (state.assets.find((asset) => asset.id === selectedCoinData.id)) {
      setTradeCoinAmount(
        state.assets.find((asset) => asset.symbol === selectedCoinData.symbol)
          .amount
      );
    }
  };

  const handleBuyMaxPress = () => {
    setTradeAmount(state.principal);
  };

  const handleSearchInput = () => {};

  if (data === undefined) {
    return <ActivityIndicator />;
  }
  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={darkMode ? styles.darkContainer : styles.lightContainer}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={tradeModalVisible}
          onRequestClose={() => {
            setTradeModalVisible(!tradeModalVisible);
            setTransactionSuccess(false);
          }}
        >
          <Pressable
            style={styles.centeredView}
            onPress={() => setTradeModalVisible(false)}
          >
            {selectedCoinData && (
              <View style={styles.modalView}>
                <Image
                  source={{ uri: selectedCoinData.image }}
                  styles={{ width: 32, height: 32 }}
                />
                <Text style={styles.modalText}>{selectedCoinData.name}</Text>
                <Text style={styles.currencyInputLabel}>
                  Balance:&nbsp;
                  {state.principal.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </Text>
                <CurrencyInput
                  autoFocus={true}
                  value={tradeAmount}
                  onChangeValue={(value) => handleDollarInput(value)}
                  prefix="$"
                  delimiter=","
                  returnKeyType="done"
                  separator="."
                  precision={2}
                  onChangeText={(formattedValue) => {}}
                  style={{
                    color: '#fefefe',
                    fontSize: 18,
                    width: '90%',
                    textAlign: 'center',
                    borderRadius: 10,
                    borderColor: 'darkslategray',
                    borderWidth: 1,
                    marginVertical: 12,
                    padding: 12,
                  }}
                />
                <MaterialCommunityIcons
                  name="autorenew"
                  color="white"
                  size={24}
                />
                <Text style={styles.currencyInputLabel}>
                  You own:&nbsp;
                  {state.assets.find(
                    (asset) => asset.symbol === selectedCoinData.symbol
                  )
                    ? state.assets
                        .find(
                          (asset) => asset.symbol === selectedCoinData.symbol
                        )
                        .amount.toFixed(4)
                    : 0}
                </Text>
                <CurrencyInput
                  value={tradeCoinAmount}
                  onChangeValue={(value) => handleCoinInput(value)}
                  suffix={` ${selectedCoinData.symbol}`}
                  delimiter=","
                  returnKeyType="done"
                  separator="."
                  precision={4}
                  onChangeText={(formattedValue) => {}}
                  style={{
                    color: '#fefefe',
                    fontSize: 18,
                    width: '90%',
                    textAlign: 'center',
                    borderRadius: 10,
                    borderColor: 'darkslategray',
                    borderWidth: 1,
                    marginVertical: 12,
                    padding: 12,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <View>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonClose]}
                      onPress={handleSellPress}
                    >
                      <Text style={styles.textStyle}>Sell</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonClose]}
                      onPress={handleSellMaxPress}
                    >
                      <Text style={styles.textStyle}>Sell Max</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonClose]}
                      onPress={handleBuyPress}
                    >
                      <Text style={styles.textStyle}>Buy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonClose]}
                      onPress={handleBuyMaxPress}
                    >
                      <Text style={styles.textStyle}>Buy Max</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Pressable>
        </Modal>
        <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={({ item }) => (
            <ListItem
              name={item.id[0].toUpperCase() + item.id.substring(1)}
              symbol={item.symbol}
              currentPrice={item.current_price}
              priceChangePercentage7d={
                item.price_change_percentage_7d_in_currency
              }
              logoUrl={item.image}
              onPress={() => openBottomModal(item)}
            />
          )}
          ListHeaderComponent={
            <ListHeader
              title={title}
              principal={principal}
              handleSearchInput={handleSearchInput}
            />
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
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'flex-start',
            backgroundColor: '#21262d',
          }}
        ></View>
        <View style={darkMode ? styles.darkTradeView : styles.lightTradeView}>
          <View>
            <TouchableOpacity style={styles.tradeBtn} onPress={openTradeModal}>
              <Text style={styles.tradeText}>Trade</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#21262d',
  },
  lightTradeView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fefefe',
  },
  tradeBtn: {
    backgroundColor: 'steelblue',
    width: 184,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 12,
  },
  tradeText: {
    color: '#fefefe',
    fontSize: 18,
  },
  // Trade Modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: '0%',
    paddingTop: '10%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    width: '75%',
    height: '60%',
    backgroundColor: '#282a36',
    borderRadius: 20,
    padding: 35,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#6e6e6e',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    marginVertical: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 2,
  },
  currencyInputLabel: {
    color: '#ffc107',
    alignSelf: 'flex-start',
    paddingLeft: 18,
  },
  buttonOpen: {
    backgroundColor: 'slategrey',
  },
  buttonClose: {
    backgroundColor: 'steelblue',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 24,
    color: '#fefefe',
    textAlign: 'center',
  },
});

export default MarketList;
