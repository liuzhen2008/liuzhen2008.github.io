let pagesize = 500;
let url = "http://34.230.8.151:8080/api.binance.com/api/v1/aggTrades?";

function getFlow(store, coin, basecoin, startTime, cb) {
  if (!coin || !basecoin || !startTime) {
    cb(new Error("please fill out everything first"));
    return;
  }

  store.dispatch('clearFlowResults');
  coin = coin.toUpperCase();
  basecoin = basecoin.toUpperCase();

  let symbol = coin + basecoin;
  getLastOrderId(symbol)
  .then(function(lastOrderId) {
    fetchBinanceData(store, lastOrderId, startTime, symbol, 0);
  });
}

function fetchBinanceData(store, orderId, startTime, symbol, oldFlowValue) {
  orderId = orderId - pagesize;
  return fetch(url + "symbol=" + symbol + "&fromId=" + orderId)
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    let i = 0;
    if (data[0].T < startTime) {
      for ( i = 0; i < data.length; i++) {
        if (data[i].T > startTime) {
          break;
        }
      }
      return calculateFlowValue(store, data.slice(i), oldFlowValue);
    } else {
      return fetchBinanceData(store, orderId, startTime, symbol, calculateFlowValue(store, data, oldFlowValue));
    }
  });
}

function calculateFlowValue(store, data, oldFlowValue) {
  for (let i = 0; i < data.length; i ++) {
    if (data[i].m) {
      oldFlowValue += data[i].p * data[i].q;
    } else {
      oldFlowValue -= data[i].p * data[i].q;
    }
  }
  store.dispatch('addFlowResult', {value: oldFlowValue, date: new Date(data[0].T)});
  return oldFlowValue;
}


function getLastOrderId(symbol) {
  return fetch(url + "symbol=" + symbol + "&limit=1")
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    return data[0].a;
  });
}

module.exports.getFlow = getFlow;
