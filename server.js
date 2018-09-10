console.log('The server is starting up.');
//Require express
var express = require('express');
//File module
var fs = require('fs');
//Cors
var cors = require('cors');
//Read our json with fs
var exists = fs.existsSync('items.json');
var items;
if(exists) {
  console.log('Found an item list.');
  var txt = fs.readFileSync('items.json', 'utf8');
  items = JSON.parse(txt);
} else {
  console.log('No item list found, creating one now.');
  items = {};
}
console.log(items);
//Create our app with express
var app = express();
//Server port
var port = 3000;
//Create a server from our app
var server = app.listen(port, running);

function running() {
  console.log('Running server on port ' + port);
}

app.use(express.static('public'));

app.use(cors());

app.get('/add/:name/:buyPrice/:sellPrice/:maxStock?', addItem);

function addItem(request, response) {
  var item = request.params;
  var name = item.name;
  var buyPrice = Number(item.buyPrice);
  var sellPrice = Number(item.sellPrice);
  var maxStock = Number(item.maxStock);
  //Missing sell price, last argument for an item
  if(!maxStock) {
  	var reply = {
  	  msg: 'An item must have a max stock.'
  	}
  	response.send(reply);
  } else {
  	items[name] = {
 	  buy: buyPrice,
 	  sell: sellPrice,
 	  maxStock: maxStock
  	}
  	var itemData = JSON.stringify(items, null, 2);

  	fs.writeFile('items.json', itemData, finished);
  	//Callback
  	function finished(err) {
  	  if(err) {
  	  	console.log('An error occurred ' + err);
  	  } else {
  	  	console.log('Got the item data.');
  	  	reply = {
  	  	  item: name,
 	      buy: buyPrice,
 	      sell: sellPrice,
 	      maxStock: maxStock,
 	      status: 'Success, you added ' + name + ' to the item database!'
  	  	}
  	  	response.send(reply);
  	  }
  	}
  }
}

app.get('/all', sendAll);
//Send the data
function sendAll(request, response) {
  response.send(items);
}

app.get('/search/:name', searchItem);

function searchItem(request, response) {
  var name = request.params.name;
  var reply;
  if(items[name]) {
  	reply = {
  	  status: 'Found item ' + name + ' in the database.',
  	  name: name,
  	  buy: items[name].buy,
  	  sell: items[name].sell,
  	  maxStock: items[name].maxStock
  	}
  } else {
  	reply = {
  	  status: 'Item ' + name + ' not found.',
  	  name: name
  	}
  }
  response.send(reply);
}
