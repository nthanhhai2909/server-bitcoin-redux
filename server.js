var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var path = require('path');
var cors = require('cors')
var bodyParser = require('body-parser');
var User = require('./api/models/UserModel'); // create model User loading here
var Transaction = require('./api/models/TransactionModel'); // create model Transaction loading here
var favicon = require('serve-favicon');
var logger = require('morgan');
var Passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passwordHash = require('password-hash');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://trading_bitcoint_db:missing123@ds119446.mlab.com:19446/trading_bitcoint_db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(session({secret: 'mysecrect',
    cookie:{
        maxAge: 1000*60*30
    }}));
app.use(Passport.initialize());
app.use(Passport.session());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());
app.use(cors({credentials: true, origin: 'http://localhost:3001'}));

Passport.use(new LocalStrategy(
    (username, password, done) => {
        let User = mongoose.model('user');
        User.findOne({'username': username}, 'username password _id', (err, data)=>{
            if(err){
                res.send(err);
            }
            else{
                if(data === null){
                    return done(null, false);
                }
                else{
                    let hashedPassword = data.password;
                    let res = Object.assign({}, {username: username, password: password});
                    if(passwordHash.verify(password, hashedPassword))
                    {
                        return done(null, res)
                    }
                    else{
                        return done(null, false);
                    }     
                        
                }
            }
        });
    }
))

app.get('/authentication', (req, res) => {
    if(req.isAuthenticated()){
        res.send({status:'true'})
    }
    else{
        res.send({status:'false'})
    }
})

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

app.get('/loginOK', (req, res) => res.json({status:'true'}))
app.get('/loginFail', (req, res) => res.json({status: 'false'}))

Passport.serializeUser((data, done) => {
    done(null, data);

})

Passport.deserializeUser((dataInput, done) => {
    console.log('tao nek', dataInput);
    let User = mongoose.model('user');
        User.findOne({'username': dataInput.username}, 'username password _id', (err, data)=>{
            if(err){
                res.send(err);
            }
            else{
                if(data === null){
                    return done(null, false);
                }
                else{
                    let hashedPassword = data.password;
                    if(passwordHash.verify(dataInput.password, hashedPassword))
                    {
                        return done(null, data)
                    }
                    else{
                        return done(null, false);
                    }     
                        
                }
            }
        });
})

app.get('/', (req, res)=>{
    res.render("index");
})

var routerUser = require('./api/routers/UserRouter');
var routerTransaction = require('./api/routers/TransactionRouter');
routerTransaction(app);
routerUser(app, Passport);  
app.listen(port, ()=> console.log("Server running on port " + port));