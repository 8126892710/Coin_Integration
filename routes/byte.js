const router = require('express').Router();
const UserController = require('../webservices/controllers/byte');

router.post('/getStatus', UserController.getStatus)


module.exports = router;