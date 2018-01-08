let pagesize = 500;
let url = "http://34.230.8.151/binance-api/api/v1/aggTrades?";

function getFlow(store, coin, basecoin, startTime, cb) {
  if (!coin || !basecoin || !startTime) {
    cb(new Error("please fill out everything first"));
    return;
  }

  store.dispatch('clearFlowResults');
  coin = coin.toUpperCase();
  basecoin = basecoin.toUpperCase();

  let symbol = coin + basecoin;
  getFirstOrderId(symbol, startTime)
  .then(function(firstOrderId) {
    fetchBinanceData(store, firstOrderId, startTime, new Date(), symbol, 0);
  });
}

function fetchBinanceData(store, orderId, startTime, endDate, symbol, oldFlowValue) {
  return fetch(url + "symbol=" + symbol + "&fromId=" + orderId)
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    if (data.length === 0 || data[data.length - 1].T >= endDate) {
      return calculateFlowValue(store, data, oldFlowValue);
    } else {
      return fetchBinanceData(store, orderId + 500, startTime, endDate, symbol, calculateFlowValue(store, data, oldFlowValue));
    }
  });
}

function calculateFlowValue(store, data, oldFlowValue) {
  let i;
  for (i = 0; i < data.length; i ++) {
    if (data[i].m) {
      oldFlowValue += data[i].p * data[i].q;
    } else {
      oldFlowValue -= data[i].p * data[i].q;
    }
  }
  store.dispatch('addFlowResult', {value: oldFlowValue, date: new Date(data[data.length - 1].T)});
  return oldFlowValue;
}


function getFirstOrderId(symbol, startTime, endTime) {
  return fetch(url + "symbol=" + symbol + "&limit=1&startTime=" + startTime.getTime() + "&endTime=" + (startTime.getTime() + 1000 * 3600))
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    return data[0].a;
  });
}

module.exports.getFlow = getFlow;
