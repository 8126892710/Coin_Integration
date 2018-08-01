const mongoose = require('mongoose');
global.Promise = mongoose.Promise;
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    userName:{
        type: String,
         default:"verma"
    },
    password:{
        type: String,
         default:"verma"
    },
    port:{
        type: Number
        //  default:"8081" //for byte coin
        // 8333 for qtum coin
    },
    host:{
        type: String,
         default:"localhost"
    },
    network:{
        type: String,
         default:"testnet"
    },
})
let User = mongoose.model('byte', UserSchema);
module.exports = User;

