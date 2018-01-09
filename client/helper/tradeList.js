let pageSize = 500, batchSize = 15, oldFlowValue = 0, maxTicks = 20;
let url = "http://34.230.8.151/binance-api/api/v1/aggTrades?";
let store, symbol, startTime, endTime;

function Flow(s, coin, basecoin, startDate, endDate) {
  store = s;
  store.dispatch('clearFlowResults');
  coin = coin.toUpperCase();
  basecoin = basecoin.toUpperCase();
  symbol = coin + basecoin;
  startTime = startDate;
  endTime = endDate;
  oldFlowValue = 0;
  getFirstOrderId(symbol, startTime)
  .then(function(firstOrderId) {
    fetchBinanceData(firstOrderId);
  });
}

function fetchBinanceData(orderId) {
  return fetchBatch(orderId, symbol)
  .then(function(data) {
    if (data.length < pageSize * batchSize || data.length === 0 || data[data.length - 1].T > endTime) {
      let i;
      for (i = 0; i < data.length; i ++) {
        if (data[i] && data[i].T > endTime) {
          break;
        }
      }
      return calculateFlowValue(data.splice(0, i));
    } else {
      calculateFlowValue(data);
      return fetchBinanceData(orderId + batchSize * pageSize);
    }
  });
}

function fetchBatch(orderId) {
  let promises = [], i;
  for (i = 0; i < batchSize; i++) {
    promises.push(fetch(url + "symbol=" + symbol + "&fromId=" + (orderId  + pageSize * i)));
  }
  return Promise.all(promises)
  .then(function(list) {
    return Promise.all(list.map(function(item) {return item.json();}));
  })
  .then(function(list) {
    return list.reduce(function(left, right) {return left.concat(right);});
  });
}

function calculateFlowValue(data) {
  let i;
  if (!data.length) return oldFlowValue;
  for (i = 0; i < data.length; i ++) {
    if (data[i].m) {
      oldFlowValue -= data[i].p * data[i].q;
    } else {
      oldFlowValue += data[i].p * data[i].q;
    }
    if (i % pageSize === 0) {
      store.dispatch('addFlowResult', {value: oldFlowValue, date: new Date(data[i].T)});
    }
  }
  if ((i - 1) % pageSize !== 0) {
    store.dispatch('addFlowResult', {value: oldFlowValue, date: new Date(data[data.length - 1].T)});
  }
  return oldFlowValue;
}


function getFirstOrderId() {
  return fetch(url + "symbol=" + symbol + "&startTime=" + startTime.getTime() + "&endTime=" + (startTime.getTime() + 1000 * 600))
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    return data[0].a;
  });
}

module.exports.Flow = Flow;
