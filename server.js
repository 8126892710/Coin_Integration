var express = require('express'),
  app = express(),
  port = process.env.PORT || 8000,
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes Handling

// var routes = require('./api/routes/byteCoin'); //importing route
// routes(app); //register the route
app.use('/byteCoin', require('./routes/byte'));
app.use('/qtumCoin', require('./routes/qtum'));


app.use((req, res)=>{
  res.status(404).send({resource: req.originalUrl + ' not found'})
});

app.listen(port);
console.log('Coin integration api server started on port number : ' + port);

// twilio account uvProj 7983685701 0879@gmail.com
// account SID :- ACc086d5093ae431211f77af948403371d
// auth token :- 5414ea0b66a3405158d01cf9a194f1b1
// 81268927108126