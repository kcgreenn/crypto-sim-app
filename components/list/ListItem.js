import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useColorScheme,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Store } from '../../context/Store';

const ListItem = ({
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
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;
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
          {!type && (
            <View style={styles.titleWrapper}>
              <Text style={darkMode ? styles.darkTitle : styles.lightTitle}>
                {quantity > 0 ? `${quantity} - ` : ''}
                {name}
              </Text>
              <Text
                style={darkMode ? styles.darkSubtitle : styles.lightSubtitle}
              >
                {symbol.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.rightWrapper}>
          <Text style={darkMode ? styles.darkTitle : styles.lightTitle}>
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

export default ListItem;

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
  darkTitle: {
    fontSize: 18,
    color: '#c9b08d',
    // color: 'black',
  },
  lightTitle: {
    fontSize: 18,
    color: '#2e2e2e',
  },
  darkSubtitle: {
    fontSize: 14,
    color: '#A9ABB1',
    marginTop: 4,
  },
  lightSubtitle: {
    fontSize: 14,
    color: '#A9ABB1',
    marginTop: 4,
  },
  rightWrapper: {
    alignItems: 'flex-end',
  },
});
