var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

const Product = require("../models/Product");

const product_js = require('../data/product_js');

router.get("/",(req,res) => {
	Product.find({},(err,data) => {
		if(!err){
			res.json(data);
		}
	})
})

router.get("/appenddata",(req,res) => {
	// res.json(product_js)
	Product.insertMany(product_js)
	.then((data) => {
		res.send('doneee')
	})
	.catch((err) => {
		res.send(err)
	})
})

router.get("/categorylist",(req,res) => {

	Product.distinct('category', (err,categories) => {
		if(!err){
			res.json(categories);
		}
	})

});

router.get("/category/:name",(req,res) => {

	let catName = req.params.name;

	Product.find({category:catName},(err,products) => {
		if(!err){
			if(products == null){
				res.json({success:false,reason:'No record'})
			}else{
				res.json({success:true,data:products})
			}
		}
	})

})

module.exports = router;