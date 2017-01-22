var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.all(Verify.verifyOrdinaryUser)
.get(function(req,res,next){
    var userId = req.decoded._doc._id;
    Favorites.find({"postedBy":userId}).populate('dishes').exec(function(err, favorites) {
        if (err) throw err;
        res.json(favorites);
    });
})

.post(function(req, res, next) {
    var userId = req.decoded._doc._id;
    console.log(userId);
    Favorites.update(
        {postedBy: userId},
        {$setOnInsert: {postedBy: userId}},
        {upsert: true},
        function(err, res) {
            console.log('upsert result:');
            console.log(res);
        }
    );
    Favorites.findOne(
        {postedBy: userId},
        function(err, favorites) {
            if (err) throw err;
            var dishId = req.body._id;
            console.log("adding dish with dishId = " + dishId);
            if (favorites.dishes == undefined) {
                favorites.dishes = [dishId];
            }
            else {
                if (favorites.dishes.indexOf(dishId) == -1) {
                    favorites.dishes.push(dishId);
                }
                else {
                    console.log("dish already in dishes");
                }
            }
            console.log("favorites:");
            console.log(favorites);
            favs.save(function(err, favorites) {
                if (err) throw err;
                console.log('Updated favorites');
                res.json(favorites);
            });
        }
    );
})

.delete(function(req, res, next) {
    var userId = req.decoded._doc._id;
    Favorites.findOne(
        {postedBy: userId},
        function(err, favorites) {
            if (err) throw err;
            if (favorites.dishes != undefined) {
                favorites.dishes = [];
            }
            favorites.save(function(err, favorites) {
                if (err) throw err;
                console.log('Updated favorites');
                res.json(favorites);
            });
        }
    );
});

favoriteRouter.route('/:dishId')
.all(Verify.verifyOrdinaryUser)
.delete(function(req, res, next) {
    var userId = req.decoded._doc._id;
    Favorites.findOne(
        {postedBy: userId},
        function(err, favorites) {
            if (err) throw err;
            var dishId = req.params.dishId;
            console.log("deleting dish with dishId = " + dishId);
            if (favorites.dishes != undefined) {
                var index = favorites.dishes.indexOf(dishId)
                if (index > -1) {
                    favorites.dishes.splice(index);
                }
                else {
                    console.log("dish not in dishes");
                }
            }
            favorites.save(function(err, favorites) {
                if (err) throw err;
                console.log('Updated favorites');
                res.json(favorites);
            });
        }
    );
});

module.exports = favoriteRouter;
