//http://172.16.6.15:8081/


// const getAddress = (req,res)=>{
//     console.log("umesh kumar wallet =====>",wallet)
//     wallet.getAddresses((err,result)=>{
//         console.log("err,result",err,result)
//         if(err)
//             return res.send('Error=====>',err)
//         else
//         res.send({'Response Code ': 200,'Response message':'Client address',"Result" : result})
//     })

//     wallet.createAddress().then(err=>console.log("err==>",err))
// }

'use strict';

const Wallet = require('wallet-module')
const Utils = require('../../helper/constants');
const Config = require('config');
const wallet = new Wallet('127.0.0.1', 8070)
//const client = new Client(Config.get('Litecoin.testnet'));
// let wallet = new Wallet({           "username": "Manish", 
//                                     "password": "Manish",
//                                     "port": 8070,
//                                     "host": "172.16.6.15",
//                                     "network": "testnet",
//                                     // "headers": {},
//                                     // "method": "POST"
//                                  })

// /**
//  * Returns array of unspent transaction inputs in the wallet
//  *
//  * @return {Array} unspent transactions
//  */
// const listUnspent = async () => {
//     try {
//         let unspent = await client.listUnspent();
//         return unspent;
//     }
//     catch (err) {
//         //Failed to fetch unspent transactions.
//         console.log(err);
//     }

// }

// /**
//  * Calculate transaction fees for Regular pay-to addresses
//  * (Legacy Non-segwit - P2PKH/P2SH)
//  *
//  * @param  {Integer} Total inputs of unspent transactions
//  * @param  {Integer} Total outputs
//  * @param  {Integer} # of confirmations for the transaction to calculate the transaction fees
//  * @return {Double}  Transaction Fee
//  */
// const calculateTxFee = async(input, output, confirmations) => {
//     try {
//         const fee = await client.estimateSmartFee(6);
//         if (fee['errors'])
//             fee['feerate'] = 0.00010024;

//         var txFee = (((input * 148 + output * 34 + 10) + 40) / 1024) * fee['feerate'];
//         return txFee;
//     }
//     catch (err) {
//         console.log(err);
//     }
// }

// /**
//  * Create a transaction spending given inputs, send to given address(es)
//  *
//  * @param  {Array} Transaction Object
//  * @param  {String} Sending Address
//  * @param  {Float} Spendable Amount
//  * @return {String} Returns the hex-encoded transaction in a string
//  */
// const createRawTransaction = async(transactions, sendTo, amount, fee) => {

//     if (fee) {
//         var txFee = Utils.round(fee, '8');
//         amount = amount - txFee;
//         amount = Utils.round(amount, '8');
//     }

//     try {
//         if (txFee) {
//             let transactionFee = await client.setTxFee(txFee);
//         }
//         let rawtxid = await client.createRawTransaction(transactions, {[sendTo] : amount });
//         return rawtxid;
//     }
//     catch (err) {
//         console.log(err);
//     }
// }


// /**
//  * @param  {[type]}
//  * @return {[type]}
//  */
// const fundRawTransaction = async(rawTransaction, changeAddress) => {

//     try {
//         if (changeAddress) {
//             let frt = await client.fundRawTransaction(rawTransaction, {"changeAddress" : changeAddress});
//             return frt;
//         }
//         else {
//             let frt = await client.fundRawTransaction(rawTransaction);
//             return frt;
//         }
//     }
//     catch (err) {
//         console.log(err);
//     }
// }

// /**
//  * Adds signatures to a raw transaction and returns the resulting
//  * raw transaction.
//  *
//  * @param  {String} Hex encoded transaction
//  * @return {String} Signed raw transaction
//  */
// const signRawTransaction = async(rawTransaction) => {
//     try {
//         let signedTransaction = await client.signRawTransaction(rawTransaction);
//         return signedTransaction;
//     }
//     catch (err) {
//         console.log(err);
//     }
// }
// const signRawTransaction = async(rawTransaction) => {
//     try {
//         let signedTransaction = await client.signRawTransaction(rawTransaction);
//         return signedTransaction;
//     }
//     catch (err) {
//         console.log(err);
//     }
// }

exports.getStatus = function(req, res) {
  console.log("jdfjdiju")
  var account = req.body.account;
  console.log("req.body.account",req.body,account)
  
  wallet.getAddresses().then(data=>{
  console.log("data==>>",data)
  }).catch(err=>{
  console.log("error==>>",err)
  })
  // wallet.getAddresses(function(err, address) {
  // console.log("err,address----")
  // if (err) {
  // return console.error(err);
  // }
  // console.log("Your address of account : "+account+" is",address);
  // res.json({'code': 200, "address": address})
  // });
  };
  
 




