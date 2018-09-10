var request = require('request');
var fs = require('fs');

const config = require('./config.json');

let keyBuyPrice = 0;
let keysSellPrice = 0;
let maxKeyStock = 0;

console.log('Running test app.');
//Update prices from a server api
function updatePrices() {
  //Variables
  var item = 'Mann Co. Supply Crate Key';
  //Request the key prices
  request('http://localhost:3000/all', function(err, res, data) {
  	if(err) {
  	  console.log('Error requesting data from server...');
  	} else {
  	  prices = JSON.parse(data);
  	  if(prices[item]) {
  	    console.log('Found item: ' + item);
  	    console.log(prices[item]);
  	    prices[item] = {
  	      buy: prices[item].buy,
  	      sell: prices[item].sell,
  	      maxStock: prices[item].maxStock
  	    }
  	    var priceData = JSON.stringify(prices, null, 2);
  	    //Write file
  	    fs.writeFile('prices.json', priceData, finished);
  	    //Succes
  	    function finished(err) {
  	      if(err) {
  	      	console.log('An error occurred ' + err);
  	      } else {
  	      	console.log('Succes saving file!');
  	      	keyBuyPrice = prices[item].buy;
  	      	keysSellPrice = prices[item].sell;
  	      	maxKeyStock = prices[item].maxStock;
  	      	config.key.buy = prices[item].buy
            console.log('Buy price: ' + keyBuyPrice + ', sell price ' + keysSellPrice  + ' & max stock ' + maxKeyStock);
  	      }
  	    }
  	  } else {
  	    console.log('Item: ' + item + ' not found.');
  	  }
    }
  });
}

setInterval(function() {
  updatePrices();
}, 30000);
