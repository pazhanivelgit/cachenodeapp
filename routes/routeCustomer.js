var async = require('async');
var util = require('../public/util');
var cache = require('memory-cache');
var cfenv = require("cfenv");
var vcap_services = process.env.VCAP_SERVICES;
//var vcap_services = require('./vcapServices');
vcap_services = JSON.parse(vcap_services);
var rediscloud_service = vcap_services['p-redis'][0];
var credentials = rediscloud_service.credentials;

var appenv = cfenv.getAppEnv();

var instanceId = process.env.CF_INSTANCE_INDEX || 0;//appenv.app.instance_index || 0;

var cache_time = 20000;// milliseconds


//function getInstanceId() {
//    return process.env.NODE_APP_INSTANCE||'no instance id';
//}

function addCache(key, value) {
    cache.put(key, value, cache_time, function (key, value) {
        console.log('caching key-'+key + ' value-' + value);
    });
}

exports.getCustomerById = function routeGetCustomerById(req, res, next) {
    var cus_id = req.params.customerId;
    if (cus_id) {
        var id = parseInt(cus_id);
        var fullUrl = req.protocol + '://' + req.get('host') + '/nodeapp/customers/' + req.params.customerId;
        //var instanceId=getInstanceId();
        var cache_resp=cache.get(id);
        if (cache_resp) {
            cache_resp.message = 'response from SERVER cache';
            cache_resp.host_url = fullUrl;
            cache_resp.instance_id = instanceId;
            res.status(200).json(cache_resp);
        }
        else {
            var customer = require("../model/customer");
            customer.find({ customer_id: id }, util.exculdeFields, function (err, customer) {
                if (err) {
                    res.status(400).json(util.showMessage('error:' + err.name));
                } else {
                    
                    if (customer.length > 0) {
                        //var fullUrl = req.protocol + '://' + req.get('host') + '/nodeapp/customers/' + req.params.customerId;
                        var resp = {};
                        resp.message = 'response from Backend(MongoDB)';
                        //resp.vacp_services = rediscloud_service;
                        resp.host_url = fullUrl;
                        resp.instance_id = instanceId;
                        resp.entry = customer[0];
                        addCache(id,resp);
                        res.status(200).json(resp);
                        //res.status(200).json(customer[0]);
                    }
                    else {
                        res.status(404).json(util.showMessage('No records found!'));
                    }
                }
            });
        }
    }
    else {
        res.status(400).json(util.showMessage('Invalid params!'));
    }
}


exports.deleteCustomerById = function deleteCustomerById(req, res, next) {
    var cus_id = req.params.customerId;
    var id = parseInt(cus_id);
    var customer = require("../model/customer");
    customer.findOneAndRemove({ customer_id: id }, function (err,status) {
        if (err) {
            res.status(400).json(util.showMessage('error:' + err.name));
        }else{
            if(status){
                res.status(200).json(util.showMessage('deleted!'));
            }else{
                 res.status(500).json(util.showMessage('No matching record found'));
            }              
        }
    });
};



exports.getAllCustomers=function routeGetAllCustomersRequest(req, res, next) {
    
    var customer = require("../model/customer");
    
    customer.find({}, util.exculdeFields, function (err, customers) {
        if (err) {
            res.status(400).json(util.showMessage('error:' + err.name));
        } else {
            
            var resp = {
                'total_count': customers.length,
                'entries': customers
            }
            res.status(200).json(resp);
        }
    });
}

exports.addCustomer=function routeCustomerInsertRequest(req, res, next) {
    
    var c_name = req.body.customer_name;
    var c_id = req.body.customer_id;
    var c_location=req.body.customer_location;
    if (c_name && c_id) {
        var customer = require("../model/customer");
        // to check whether customer id already exist or not
        var isCustomerExist = function(next){
            //var isCustomer = 0;
            req.isCustomer = 0;
            customer.find({ customer_id: c_id }, util.exculdeFields, function (err, customer) {
                if (err) {
                    res.status(400).json(err);
                } else {
                    if (customer.length > 0) {
                        req.isCustomer = 1;
                        next(null,req);
                    }
                    else {
                        next(null,req);
                    }
                }
            });

        };

        // to insert the datat to db
        var insertData = function(req,next){
            if (req.isCustomer === 0) {
                
                //var customer = require("../model/customer");
                var _customer = new customer({ customer_name: c_name, customer_id: c_id, customer_location:c_location});

                _customer.save(function (err, userObj) {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        next(null,[]);
                    }
                });
            }else{
                //var errObj = util.createError(error_const.CUSTOMEREXIST);
                next({'messge':'already exist!'},null);
            }
        };

        var finalResult = function(err,result){
            if(err){
                res.status(400).json(err);
            }else{
                res.status(201).json(util.showMessage('saved successfully!'));
            }

        };

        
        //async.waterfall([isCustomerExist, CreateCustomerFolder, CreateMiscelleousFolder, insertData], finalResult);
        async.waterfall([isCustomerExist, insertData], finalResult);

    }
    else {
        res.status(400).json(util.showMessage('Invalid params!'));
    }
}


exports.updateCustomer = function updateCustomer(req, res, next) {
    var c_name = req.body.customer_name;
    var c_id = req.params.customerId;
    var c_location = req.body.customer_location;
    
    if (c_name && c_id) {
        var reqbody = { 'customer_id': c_id, 'customer_name': c_name, 'customer_location': c_location };
        var customer = require("../model/customer");
        customer.findOneAndUpdate({ customer_id: c_id }, reqbody, function (err, result) {
            if (err) {
                res.status(500).json({ 'error': err.message });
            } else {
                cache.del(c_id);
                res.status(200).json({ 'message': 'success'});
            }
        });
    }
    else {
        res.status(400).json(util.showMessage('Invalid params!'));
    }

}