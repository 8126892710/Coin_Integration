const router = require('express').Router();
const UserController = require('../webservices/controllers/qtum');

router.post('/generateAddress', UserController.generateAddress)
router.post('/generateNewAddress', UserController.generateNewAddress)
router.post('/getBalance', UserController.getBalance)
router.post('/getReceivedByAccount', UserController.getReceivedByAccount)
router.post('/performTransfer', UserController.performTransfer)
router.post('/performWithdraw', UserController.performWithdraw)
// router.post('/uploadImage', UserController.uploadImage)

module.exports = router;