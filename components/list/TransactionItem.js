import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Store } from '../../context/Store';

const TransactionItem = ({
  boughtCoinName,
  coinAmount,
  dollarAmount,
  soldCoinName,
  date,
  onPress,
  returnToDate,
}) => {
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.itemWrapper}>
        <View style={styles.leftWrapper}>
          <Text
            style={[
              darkMode ? styles.darkTitle : styles.lightMode,
              { fontSize: 18, fontWeight: 'bold' },
            ]}
          >
            Converted to {boughtCoinName}
          </Text>
          <Text style={darkMode ? styles.darkSubtitle : styles.lightSubtitle}>
            Using {soldCoinName}
          </Text>
        </View>
        <View style={styles.rightWrapper}>
          <Text style={darkMode ? styles.darkTitle : styles.lightTitle}>
            {boughtCoinName === 'USD' ? dollarAmount : coinAmount.toFixed(6)}
          </Text>
          <Text
            style={[
              darkMode ? styles.darkSubtitle : styles.lightSubtitle,
              { color: '#34c759' },
            ]}
          >
            {date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  itemWrapper: {
    paddingHorizontal: 16,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#cecece',
  },
  leftWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  titleWrapper: {
    marginLeft: 8,
  },
  image: {
    height: 48,
    width: 48,
  },
  darkTitle: {
    fontSize: 18,
    color: '#fefefe',
  },
  lightTitle: {
    fontSize: 18,
    color: '#c9b08d',
  },
  darkSubtitle: {
    fontSize: 14,
    color: '#cecece',
    marginTop: 4,
  },
  lightSubtitle: {
    fontSize: 14,
    color: '#3e3e3e',
    marginTop: 4,
  },
  rightWrapper: {
    alignItems: 'flex-end',
  },
});
