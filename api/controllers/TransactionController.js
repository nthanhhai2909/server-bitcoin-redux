'use strict'
var mongoose = require('mongoose');
var Transaction = mongoose.model('transaction');


exports.getListTransaction = (req, res) =>{
    Transaction.find({}, (err, transactions)=>{
        if(err){
            res.send({status: 'false'});
        }
        transactions = transactions.sort((a,b) => {
            return parseFloat(b.date) - parseFloat(a.date);
        });
        res.send({status: 'true', data:transactions});
    });
}

exports.addTransaction = (req, res) =>{
    var new_transaction = new Transaction({
        username_sent: req.body.username_sent,
        username_receive: req.body.username_receive,
        date: req.body.date,
        transaction_amount: req.body.transaction_amount,
        description: req.body._description
    });
    new_transaction.save((err, data) => {
        if(err){
            res.send({status: 'false'});
        }
        else{
            res.send({status: 'true'});
        }
    });
}
exports.getTransactionOfUser = (req, res) =>{
    Transaction.find({$or:[{username_sent: req.params.username} , {username_receive: req.params.username}]}, (err, transactions) =>{
        if(err){
            res.send({status: 'false'});
        }
        transactions = transactions.sort((a,b) => {
            return parseFloat(b.date) - parseFloat(a.date);
        });
        transactions = transactions.slice(0, transactions.length > 10 ? 10 : transactions.length );
        res.send({status: 'true', data:transactions});
    });
    
}
