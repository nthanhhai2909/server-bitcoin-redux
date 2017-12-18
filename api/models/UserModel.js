'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
require('mongoose-double')(mongoose);
var User = new Schema({
    fullname: {type: String},
    username: { type:String,
             required: true,
              unique: true},   
    password: {type:String},
    idWallet : {type:String},
    balance: {type:String} ,
});
module.exports = mongoose.model('user', User);