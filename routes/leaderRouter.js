var express = require('express');
var Verify = require('./verify');
var Leaders = require('../models/leadership');

var leaderRouter = express.Router();

leaderRouter.route('/')
.get(function(req,res,next){
    Leaders.find(req.query, function(err, dish) {
        if (err) next(err);
        res.json(dish);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    res.end('Deleting all leaderes');
});

leaderRouter.route('/:leaderId')
.all(function(req,res,next) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    next();
})

.get(function(req,res,next){
    res.end('Will send details of the leader: ' + req.params.leaderId +' to you!');
})

.put(Verify.verifyOrdinaryUser, function(req, res, next){
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name +
            ' with details: ' + req.body.description);
})

.delete(Verify.verifyOrdinaryUser, function(req, res, next){
    res.end('Deleting leader: ' + req.params.leaderId);
});

module.exports = leaderRouter;
