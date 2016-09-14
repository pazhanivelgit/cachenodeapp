var mongoose = require('./db.js');

var customer_schema = new mongoose.Schema({
    customer_name: String, 
    customer_id: { type: Number, index: true },
    customer_location: String
});

var customer = mongoose.model('customer', customer_schema);

module.exports = customer;