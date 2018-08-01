// //http://127.0.0.1:13889/
'use strict';

const Client = require('bitcoin-core');
const Utils = require('../../helper/constants');
const Config = require('config');

let client = new Client({
    "username": "umesh",
    "password": "umesh",
    "port": 13889,
    "host": "127.0.0.1",
    "network": "testnet"
})

/**
 * Returns array of unspent transaction inputs in the wallet
 *
 * @return {Array} unspent transactions
 */
const listUnspent = async () => {
    try {
        let unspent = await client.listUnspent();
        console.log("Unspent ==========================", unspent)
        return unspent;
    }
    catch (err) {
        //Failed to fetch unspent transactions.
        console.log(err);
    }

}

/**
 * Calculate transaction fees for Regular pay-to addresses
 * (Legacy Non-segwit - P2PKH/P2SH)
 *
 * @param  {Integer} Total inputs of unspent transactions
 * @param  {Integer} Total outputs
 * @param  {Integer} # of confirmations for the transaction to calculate the transaction fees
 * @return {Double}  Transaction Fee
 */
const calculateTxFee = async (input, output, confirmations) => {
    try {
        const fee = await client.estimateSmartFee(6);
        if (fee['errors'])
            fee['feerate'] = 0.00010024;

        var txFee = (((input * 148 + output * 34 + 10) + 40) / 1024) * fee['feerate'];
        console.log("txFee,input,output=====>>",txFee,input,output)
        return -txFee;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Create a transaction spending given inputs, send to given address(es)
 *
 * @param  {Array} Transaction Object
 * @param  {String} Sending Address
 * @param  {Float} Spendable Amount
 * @return {String} Returns the hex-encoded transaction in a string
 */
const createRawTransaction = async (transactions, sendTo, amount, fee) => {

    if (fee) {
        var txFee = Utils.round(fee, '8');
        amount = amount - txFee;
        amount = Utils.round(amount, '8');
    }

    try {
        if (txFee) {
            let transactionFee = await client.setTxFee(txFee);
        }
        let rawtxid = await client.createRawTransaction(transactions, { [sendTo]: amount });
        console.log("rawtxid##########################>", rawtxid)
        return rawtxid;
    }
    catch (err) {
        console.log("Error in craeteRawTrascation====================", err);
    }
}


/**
 * @param  {[type]}
 * @return {[type]}
 */
const fundRawTransaction = async (rawTransaction, changeAddress) => {

    try {
        if (changeAddress) {
            let frt = await client.fundRawTransaction(rawTransaction, { "changeAddress": changeAddress });
            console.log("fundRawTransactions----------------------",frt)
            return frt;
        }
        else {
            console.log("frt ++++++++++++++++++",frt);
            let frt = await client.fundRawTransaction(rawTransaction);
            return frt;
        }
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Adds signatures to a raw transaction and returns the resulting
 * raw transaction.
 *
 * @param  {String} Hex encoded transaction
 * @return {String} Signed raw transaction
 */
const signRawTransaction = async (rawTransaction) => {

    try {
        let signedTransaction = await client.signRawTransaction(rawTransaction);
        console.log("SingnRawTrasaction$$$$$$$$$$$$$$$$$$",signedTransaction);
        return signedTransaction;
    }
    catch (err) {
        console.log(err);
    }
}


/**
 * Submits raw transaction (serialized, hex-encoded) to local node and network.
 *
 * @param  {String} Signed transaction
 * @return {String} Transaction Id
 */
const sendRawTransaction = async (signedTransaction) => {
    try {
        let sendTransactions = await client.sendRawTransaction(signedTransaction);
        console.log("sendTransaction_____________",sendTransactions);
        return sendTransactions;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Returns the current bitcoin address for receiving payments to this account.
 * If <account> does not exist, it will be created along with an associated
 * new address that will be returned.
 *
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
exports.generateAddress = function (req, res) {
    var account = req.params.account;

    client.getAccountAddress(account, function (err, address) {
        if (err) {
            return console.error(err);
        }
        res.json({ 'code': 200, "address": address })
    });
};
exports.generateNewAddress = function (req, res) {
    var account = req.body.account;

    client.getNewAddress(account, function (err, address) {
        if (err) {
            return console.error(err);
        }
        console.log("Your new  address of account : " + account + " is", address);
        res.json({ 'code': 200, "address": address })
    });
};


/**
 * If [account] is not specified, returns the server's total available
 * balance. If [account] is specified, returns the balance in
 * the account.
 *
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
exports.getBalance = function (req, res) {
    var address = req.body.address;

    listUnspent().then(unspent => {
        var unspentBalance = unspent.filter((unspent) => unspent.account == address);
        var balance = 0;
        if (unspentBalance.length) {
            for (var transactions in unspentBalance) {
                balance += unspentBalance[transactions].amount;
            }
        }
        balance = Utils.round(balance, '8');
        res.json({ 'code': 200, "balance": balance });
    });
};

/**
 * Returns up to [count] most recent transactions skipping the
 * first [from] transactions for account [account].
 * If [account] not provided it'll return recent transactions
 * from all accounts.
 *
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
exports.getReceivedByAccount = function (req, res) {
    var address = req.body.address;

    client.listTransactions(address, function (err, deposits) {
        if (err) {
            return console.log(err);
        }
        if (deposits.length) {
            var depositSubet = [];
            for (var deposit in deposits) {
                var subset = (({ txid, amount, confirmations }) => ({ txid, amount, confirmations }))(deposits[deposit]);
                depositSubet.push(subset);
            }
            res.json(depositSubet);
        }
        else {
            res.json({ "code": "500" })
        }
    });
};

/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
exports.performTransfer = function (req, res) {

    // Get all unspent transactions
    listUnspent().then(unspent => {
        var sendTransactions = unspent.filter((unspent) => unspent.address == req.body.SendFrom);
        console.log("sendTransaction ======> ", sendTransactions)
        var listTransactions = [];
        var transactionAmount = 0;

        if (sendTransactions.length) {
            for (var transactions in sendTransactions) {
                listTransactions.push({
                    'txid': sendTransactions[transactions].txid,
                    'vout': sendTransactions[transactions].vout
                });
                console.log("listTransaction ++++++++++++++++++++++", listTransactions)
                transactionAmount += sendTransactions[transactions].amount;
                console.log("transactionAmount===============", transactionAmount)
            }

            calculateTxFee(listTransactions.length, 1, 6).then(fee => {
                console.log("fee===============", fee)
                createRawTransaction(listTransactions, req.body.SendTo, transactionAmount, fee).then(rawtxid => {
                    console.log("createrawTransaction ===============>", rawtxid)
                    signRawTransaction(rawtxid).then(signedTransaction => {
                        console.log("signrawTransaction ===============>", signedTransaction)
                        sendRawTransaction(signedTransaction['hex']).then(sendTransactions => {
                            console.log("sendTransaction ===============>", sendTransactions)
                            res.json({
                                'code': 200,
                                'tx-hash': sendTransactions,
                                'fee': Utils.round(fee, '8'),
                                'sent-amount': transactionAmount
                            });
                        });
                    });
                });
            });
        }
        else {
            res.json({ 'code': 500, "message": "No unspent transaction found for given address." });
        }
    });
};


/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
exports.performWithdraw = function (req, res) {

    //SendTo
    //AmountToTransfer
    //ChangeAddress
    var changeaddress = req.body.ChangeAddress ? req.body.ChangeAddress : null;
    // Get all unspent transactions
    listUnspent().then(unspent => {
        var sendTransactions = unspent.filter((unspent) => unspent.address == req.body.SendFrom);
        var listTransactions = [];
        var transactionAmount = 0;

        if (sendTransactions.length) {
            for (var transactions in sendTransactions) {
                listTransactions.push({
                    'txid': sendTransactions[transactions].txid,
                    'vout': sendTransactions[transactions].vout
                });
                transactionAmount += sendTransactions[transactions].amount;
            }

            // Check if sufficient funds available...
            if (req.body.AmountToTransfer < transactionAmount) {
                //Updated to use the fundRawTransaction method
                createRawTransaction(listTransactions, req.body.SendTo, req.body.AmountToTransfer, null).then(rawtxid => {
                    fundRawTransaction(rawtxid, changeaddress).then(frt => {
                        signRawTransaction(frt['hex']).then(signedTransaction => {
                            sendRawTransaction(signedTransaction['hex']).then(sendTransactions => {
                                res.json({
                                    'code': 200,
                                    'tx-hash': sendTransactions,
                                    'fee': frt['fee']
                                });
                            })
                                .catch(e => { res.json({ 'sendRawTransaction': 400 }) })
                        })
                            .catch(e => { res.json({ 'signRawTransaction': 400 }) })
                    })
                        .catch(e => { res.json({ 'fundRawTransaction': 400 }) })
                })
                    .catch(e => { res.json({ 'createRawTransaction': 400 }) })
            }
            else {
                res.json({ 'code': 500, "message": "Insufficient Funds!" });
            }
        }
        else {
            res.json({ 'code': 500, "message": "No unspent transaction found for given address." });
        }
    })
}
// var cloudinary = require('cloudinary')
// cloudinary.config({
//     cloud_name: "dd2nkypuv",
//     api_key: "163421263669766",
//     api_secret: "F7WElDPc8u0iP-_bz2zMLZqdbYQ"
// });
// exports.uploadImage = function (image_data, callback) {

//     var binaryData = new Buffer('image_data', 'base64');
//     console.log("console log =====>>", binaryData)
//     return cloudinary.uploader.upload(image_data, function (result) {
//         if (result) {
//             console.log(result.url)
//             callback(null, result.url);
//         }
//     })
// }
