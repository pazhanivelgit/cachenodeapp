'use strict';

var router = require('express').Router();
var routeCustomer = require('./routeCustomer');

var basePath = '/nodeapp';
var subPathRedis='/nodeapp/redis';
//router.post(basePath + '/authenticate', routeUserAuth.getUserAuthorization);
//router.post(basePath + '/authenticate', routeUserAuth.authenticateUser); // to authenticate a user

//for Admin UI
router.get(basePath + '/customers', routeCustomer.getAllCustomers); // get all customers
router.post(basePath + '/customers', routeCustomer.addCustomer); // add customers
router.get(basePath + '/customers/:customerId', routeCustomer.getCustomerById); // get customer by customer id 
router.delete(basePath + '/customers/:customerId', routeCustomer.deleteCustomerById); // delete customer
router.put(basePath + '/customers/:customerId', routeCustomer.updateCustomer);

var routeRedisCustomer = require('./redisCustomer');
router.get(subPathRedis + '/customers/:customerId', routeRedisCustomer.getCustomerById); // get customer by customer id 

//session
var routeSession = require('./session');
router.post(basePath + '/login', routeSession.login);
router.get(basePath + '/dashboard', routeSession.dashboard);
router.post(basePath + '/logout', routeSession.logout);




module.exports = router;