import axios from 'axios';
import moment from 'moment';

const format7dSparkline = (numbers) => {
  const sevenDaysAgo = moment().subtract(7, 'days').unix();
  let formattedSparkline = numbers.map((item, index) => {
    return {
      x: sevenDaysAgo + (index + 1) * 3600,
      y: item,
    };
  });
  return formattedSparkline;
};

const format1dSparkline = (numbers) => {
  const oneDayAgo = moment().subtract(1, 'days').unix();
  let formattedSparkline = numbers.map((item, index) => {
    return {
      x: oneDayAgo + (index + 1) * 3600,
      y: item,
    };
  });
  return formattedSparkline;
};

const formatMarketData = (data) => {
  let formattedData = [];

  data.forEach((item) => {
    const formattedSparkline = format7dSparkline(item.sparkline_in_7d.price);

    const formattedItem = {
      ...item,
      sparkline_in_7d: {
        price: formattedSparkline,
      },
    };
    formattedData.push(formattedItem);
  });
  return formattedData;
};

export const getMarketData = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d'
    );
    const { data } = response;
    const formattedResponse = formatMarketData(data);
    return formattedResponse;
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserMarketData = async (assetNames) => {
  const assetCalls = assetNames.join('%2C%20');

  const assetRequest = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${assetCalls}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=7d`;

  try {
    const response = await axios.get(assetRequest);

    const { data } = response;

    const formattedResponse = formatMarketData(data);

    return formattedResponse;
  } catch (errors) {
    errors.forEach((error) => console.log(error.message));
  }
};
