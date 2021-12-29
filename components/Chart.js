import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartYLabel,
  CurrentPositionVerticalLine,
} from '@rainbow-me/animated-charts';
import { Ionicons } from '@expo/vector-icons';
import { useSharedValue } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';

const Chart = ({
  currentPrice,
  logoUrl,
  name,
  symbol,
  priceChangePercentage1h,
  priceChangePercentage24h,
  priceChangePercentage7d,
  sparkline,
}) => {
  const latestCurrentPrice = useSharedValue(currentPrice); // Creates a value that can be shared btwn the UI and JS threads
  const [chartReady, setChartReady] = useState(false);
  const [selectedTime, setSelectedTime] = useState('7d');

  const { width: SIZE } = Dimensions.get('window');

  useEffect(() => {
    latestCurrentPrice.value = currentPrice;

    setTimeout(() => {
      setChartReady(true);
    }, 0);
  }, [currentPrice]);

  const formatUSD = (value) => {
    'worklet';
    if (value === '') {
      const formattedValue = `$${latestCurrentPrice.value.toLocaleString(
        'en-US',
        { currency: 'USD' }
      )}`;
      return formattedValue;
    }
    const formattedValue = `$${parseFloat(value)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    return formattedValue;
  };
  const Item = Picker.Item;
  return (
    <ChartPathProvider
      data={{ points: sparkline, smoothingStrategy: 'bezier' }}
    >
      <View style={styles.chartWrapper}>
        <TouchableOpacity style={styles.titleWrapper}>
          <View style={styles.upperTitle}>
            <View style={styles.upperLeftTitle}>
              <Image source={{ uri: logoUrl }} style={styles.image} />
              <Text style={styles.subtitle}>
                {name} ({symbol.toUpperCase()})
              </Text>
            </View>
            <Text style={styles.subtitle}>7d</Text>
          </View>
          <View style={styles.lowerTitle}>
            <ChartYLabel format={formatUSD} style={styles.boldTitle} />
            <Text
              style={[
                styles.title,
                {
                  color: priceChangePercentage7d > 0 ? '#34C759' : '#FF3B30',
                },
              ]}
            >
              {priceChangePercentage7d.toFixed(2)}%
            </Text>
          </View>
        </TouchableOpacity>
        {chartReady ? (
          <View style={styles.chartLineWrapper}>
            <ChartPath height={SIZE / 2} stroke="black" width={SIZE} />
            <ChartDot style={{ backgroundColor: 'turquoise ' }} />
          </View>
        ) : null}
      </View>
    </ChartPathProvider>
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    marginVertical: 16,
  },
  titleWrapper: {
    marginHorizontal: 16,
  },
  upperTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lowerTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upperLeftTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 24,
    width: 24,
    marginRight: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#A9ABB1',
  },
  boldTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
  },
  chartLineWrapper: {
    marginTop: 40,
  },
  tradeBtn: {
    borderRadius: 5,
    // borderColor: 'blue',
    // borderWidth: 1,
    width: 84,
    backgroundColor: 'steelblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  tradeIcon: {
    fontSize: 14,
    color: '#fefefe',
  },
});

export default Chart;
