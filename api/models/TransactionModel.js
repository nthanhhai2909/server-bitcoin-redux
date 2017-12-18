'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
require('mongoose-double')(mongoose);
var Transaction = new Schema({
    username_sent: {type: String},
    username_receive: { type:String},
    date: {type:String},
    transaction_amount: {type:String} ,
    description: {type:String}
});

module.exports = mongoose.model('transaction', Transaction);