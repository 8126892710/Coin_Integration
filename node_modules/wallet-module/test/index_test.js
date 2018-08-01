'use strict';
const crushcoinWallet = require('../lib/wallet');
const expect = require('chai').expect;


describe('crushcoinWallet', () => {
    const Wallet = new crushcoinWallet();

    describe('constructor', () => {
        it('should have default host set to `127.0.0.1`', () => {
            new crushcoinWallet().hostname.should.equal('127.0.0.1');
        });

        it('should have default port set to 8070', () => {
            new crushcoinWallet().port.should.equal(8070);
        });
    });

    describe('methods', () => {
        describe('getBalance()', () => {
            it('should retrieve the account balance', (done) => {
                Wallet.balance().then(function(result){
                    result.balance.should.be.a.Number();
                    done();
                })
            })
        })

        describe('getAddresses()', () => {
            it('should return the account address', (done) => {
                Wallet.getAddresses().then(function(result){
                    result.address.should.be.a.String();
                    done();
                })
            })
        })

        describe('balance()', () => {
            it('should return the balance of the address', (done) => {
                Wallet.balance().then(result => {
                    result.balance.should.be.a.Number();
                    done();
                })
            })
        })

        describe('getSpendKeys()', () => {
            it('should return the spend keys of the address', (done) => {
                Wallet.getSpendKeys().then(result => {
                    result.spendPublicKey.should.be.a.String();
                    result.spendPrivateKey.should.be.a.String();
                    done();
                })
            })
        })
          
        describe('getStatus()', () => {
            it('should return the wallet daemon stats', (done) => {
                Wallet.getStatus().then(result => {
                    result.knownBlockCount.should.be.a.Number();
                    result.lastBlockHash.should.be.a.String();
                    result.blockCount.should.be.a.Number();
                    result.peerCount.should.be.a.Number();
                    done();
                })
            })
        })
        
        describe('deleteAddress()', () => {
            it('should delete an address from the wallet', (done) => {
                Wallet.deleteAddress().then(result => {
                    expect(result).to.equal({});
                    done();
                })
            })
        })
        
        describe('getBlockHashes()', () => {
            it('should retuen an array of block hashs from the range', (done) => {
                Wallet.getBlockHashes().then(result => {
                    expect(result).haveOwnProperty('blockhashes');
                    done();
                })
            })
        })
        
        describe('getTransactionHashes()', () => {
            it('should return an array of transaction hashes', (done) => {
                Wallet.getTransactionHashes().then(result => {
                    expect(result).haveOwnProperty('items');
                    done();
                })
            })
        })
        
        describe('getTransactions()', () => {
            it('should return an array of transactions', (done) => {
                Wallet.getTransactions().then(result => {
                    expect(result).haveOwnProperty('items');
                    done();
                })
            })
        })
        
        
        /**
        * // TODO complete transaction tests
        */

        describe('getDeplayedTransactionHashes()', () => {
            it('should return an array of dealyed transactions hashes', (done) => {
                Wallet.getTransactions().then(result => {
                    expect(result).haveOwnProperty('transactionHashes');
                    done();
                })
            })
        })        
    })
})
