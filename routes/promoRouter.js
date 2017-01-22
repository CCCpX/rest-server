var express = require('express');
var Verify = require('./verify');
var Promotions = require('../models/promotions');

var promoRouter = express.Router();

promoRouter.route('/')
.get(function(req,res,next){
    Promotions.find(req.query, function(err, dish) {
        if (err) next(err);
        res.json(dish);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    res.end('Deleting all promotions');
});

promoRouter.route('/:promotionId')
.get(function(req,res,next){
    res.end('Will send details of the promotion: ' + req.params.promotionId +' to you!');
})

.put(Verify.verifyOrdinaryUser, function(req, res, next){
    res.write('Updating the promotionId: ' + req.params.promotionId + '\n');
    res.end('Will update the promotion: ' + req.body.name +
            ' with details: ' + req.body.description);
})

.delete(Verify.verifyOrdinaryUser, function(req, res, next){
    res.end('Deleting promotion: ' + req.params.promotionId);
});

module.exports = promoRouter;
