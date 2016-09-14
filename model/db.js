var mongoose = require('mongoose');
//var conn = 'mongodb://localhost/passapp';
var conn = process.env.MONGODB_CONN;
mongoose.connect(conn);
//mongoose.connect('mongodb://localhost/passapp');
//mongoose.connect('mongodb://udhay:udhay@54.251.97.71:10040/testdb');
module.exports = mongoose;