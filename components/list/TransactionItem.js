import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TransactionItem = ({
  name,
  symbol,
  quantity,
  currentPrice,
  priceChangePercentage7d,
  type,
  date,
  logoUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.itemWrapper}>
        <View style={styles.leftWrapper}>
          {type ? (
            type === 'buy' ? (
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                Converted from {name}
              </Text>
            ) : (
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                Converted to {name}
              </Text>
            )
          ) : (
            <Image
              source={{
                uri: logoUrl,
              }}
              style={styles.image}
            />
          )}
        </View>
        <View style={styles.rightWrapper}>
          <Text style={styles.title}>
            $
            {quantity > 0
              ? (currentPrice * quantity).toLocaleString('en-US', {
                  currency: 'USD',
                })
              : currentPrice.toLocaleString('en-US', { currency: 'USD' })}
          </Text>
          {priceChangePercentage7d ? (
            <Text
              style={[
                styles.subtitle,
                { color: priceChangePercentage7d > 0 ? '#34C759' : '#FF3B30' },
              ]}
            >
              {priceChangePercentage7d.toFixed(2)}%
            </Text>
          ) : (
            <Text style={styles.subtitle}>{date}</Text>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWrapper: {
    marginLeft: 8,
  },
  image: {
    height: 48,
    width: 48,
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    color: '#A9ABB1',
    marginTop: 4,
  },
  rightWrapper: {
    alignItems: 'flex-end',
  },
});
