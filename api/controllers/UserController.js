'use strict'
var mongoose = require('mongoose');
var User = mongoose.model('user');
var randomstring = require("randomstring");
var passwordHash = require('password-hash');

exports.login = function(req, res){
    User.findOne({'username': req.body.username}, 'username password _id', (err, data)=>{
        if(err){
            res.send(err);
        }
        else{
            if(data === null){
                res.send({status: 'false'});
            }
            else{
                let hashedPassword = data.password;
                if(passwordHash.verify(req.body.password, hashedPassword))
                {
                    res.json({status: 'true', id:data._id, token: myToken});
                }
                else{
                    res.send({status: 'false'});
                }     
                    
            }
        }
    });
};  

exports.logup = function(req, res){
    let idWalletRandom = randomstring.generate();
    let hashedPassword = passwordHash.generate(req.body.password);
    User.findOne({'username': req.body.username}, 'username', (err, user) =>{
        if(err){
            res.send(err);
        }
        else{
            if(user === null){
                if(req.body.password === req.body.confirm){
                    var new_user = new User({
                        fullname: req.body.fullname,
                        username: req.body.username,
                        password: hashedPassword, 
                        idWallet: idWalletRandom,
                        balance: "1000",
                    });
                    new_user.save((err, date) =>{
                        if(err){
                            res.send({status: 'false', message:""});
                        }
                        else{
                            res.send({status: 'true', message:""});
                        }
                    });
                }
                else{
                    res.send({status: 'false', message:""});
                }
                
            }
            else{
                res.send({status: 'false', message: "User Already exsit"});
            }
            
        }
    });
};

exports.userSendMoney = (req, res) =>{
    User.findById(req.body._id, (err, data) => {
        if(err){
            res.send({status: 'false'});
        }
        else{
            if(data === null){
                res.send({status: 'false'});
            }
            let tranfer = parseFloat(req.body.tranfer);
            let blance = parseFloat(data.balance);
            let result = Number(Number(blance - tranfer).toFixed(12));
    
            if(result < 0){
                res.send({status: 'false'});
            }

            data.balance =  (result).toString();
            data.save((err) =>{
                if(err){
                    res.send({status: 'false'});
                }
                else{
                    res.send({status:'true', balance: data.balance});
                }
            });
        }
    }); 
}

exports.userReceiveMoney = (req, res) =>{
    User.findById(req.body._id, (err, data) => {
        if(err){
            res.send({status: 'false'});
        }
        else{
            let tranfer = parseFloat(req.body.tranfer);
            let blance = parseFloat(data.balance);
            let result = Number(Number(blance + tranfer).toFixed(12));
            data.balance =  result.toString();
            data.save((err) =>{
                if(err){
                    res.send({status: 'false'});
                }
                else{
                    res.send({status:'true', balance: data.balance});
                }
            });
        }
    }); 
}

exports.getProfileByUser = (req, res) =>{
    User.find({username: req.params.username}).exec((err, data) =>{
		if(err){
			res.send({status: 'false'});
		}
		else{
    
			res.send({status: 'true', data: data});
		}
	});
}

exports.getProfileByiWallet = (req, res) => {
    User.find({idWallet: req.params.idWallet}).exec((err, data) =>{
		if(err){
			res.send({status: 'false'});
		}
		else{
			res.send({status: 'true', data: data});
		}
	});
}

