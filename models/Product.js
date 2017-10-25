const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	productid:{
		type:String,
		required:true
	},
	picture:{
		type:String,
		required:true
	},
	gender:{
		type:String,
		required:true
	},
	title:{
		type:String,
		required:true
	},
	brand:{
		type:String,
		required:true
	},
	instruction:{
		type:String,
		required:true
	},
	details:{
		type:String,
		required:true
	},
	color:{
		type:[String],
		required:true
	},
	size:{
		type:[Number],
		required:true
	},
	category:{
		type:String,
		required:true
	},
	price:{
		type:Number,
		required:true
	}
})

var Product = mongoose.model("Products",productSchema);

module.exports = Product;