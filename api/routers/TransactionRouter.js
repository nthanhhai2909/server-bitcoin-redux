'user strict'
module.exports = function(app){
    var TransactionController = require('../controllers/TransactionController');
    

    app.route('/transaction')
    .get(TransactionController.getListTransaction)
    .post(TransactionController.addTransaction);

    app.route('/transaction/:username')
    .get(TransactionController.getTransactionOfUser);
}