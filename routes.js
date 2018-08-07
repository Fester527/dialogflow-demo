'use strict';

var express = require("express");
var router = express.Router();
var config = require("./config");
var UserInfo = require("./models").UserInfo;
var bodyParser = require("body-parser").json;
var request = require("request");

router.use(bodyParser());

var postData = {
    tenancyName: config.tenancyName,
    usernameOrEmailAddress: config.usernameOrEmailAddress,
    password: config.password
};

var auth = config.auth;

var authOptions = {
    method: "post",
    body: postData,
    json: true,
    url: auth
};

router.get("/", function(req, res, next){
    UserInfo.find({})
            .sort({accountNumber: 1})
            .exec(function(err, info){
                if(err) return next(err);
                res.json(info);
            });
});

router.post("/", function(req, res, next){
    if(req.body.queryResult.action === "userinfopls"){
            UserInfo.findOne({accountNumber: req.body.queryResult.parameters.accountNumber})
                .exec(function(err, info){
                    if(err) return next(err);
                    if(info){
                        res.json(
                            
                        );
                    } else {
                        res.json({

                        });
                    }
                    
            });
    }

    if(req.body.queryResult.action === "addQueue"){
    
        var address = req.body.queryResult.outputContexts[1].parameters.name;
        var accountNumber = req.body.queryResult.outputContexts[1].parameters.accountNumber;

        request(authOptions, function(err, response, body){
            if(err){
                console.error('error posting json: ', err);
                throw err;
            }

            var queueURL = config.queueUrl;
            
            var postDataQueue = {
                itemData: {
                    Priority: "Normal",
                    Reference: name,
                    Name: "ApiQueue",
                    SpecificContent: {
                        accountNumber: accountNumber,
                        address: address
                    }
                }
            };

            var queueOptions = {
                method: "post",
                body: postDataQueue,
                auth: { bearer: body.result},
                json: true,
                url: queueURL
            };

            request(queueOptions, function(err, response, body){
                if(err){
                    console.error('error parsing json: ', err);
                    res.sendStatus(500);
                    throw err;
                } else{
                    console.log("Operation succesfully completed");
                    res.json({
                        
                    });
                    res.sendStatus(201);
                }
            });
        });
    }
});

router.post("/newuser", function(req, res, next){
    var user = new UserInfo(req.body);
    user.save(function(err, user){
        if(err) return next(err);
        res.status(201);
        res.json(user);
    });
});

module.exports = router;