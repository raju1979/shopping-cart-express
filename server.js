const express = require('express');
const app = express();
const path = require('path');

const dotenv = require('dotenv');
dotenv.load();

const bodyParser = require("body-parser");
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(express.static(path.join(__dirname,"./public")));
app.use(bodyParser({limit: '5mb'}));

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONF,{
	useMongoClient:true
});

const cors = require('cors');
app.use(cors());

var db = mongoose.connection;
db.on('error',console.error.bind(console, 'MongoDB connection error:'))
db.once('open',() => {
	console.log('connected');
})



app.set('port',(process.env.PORT || 5000));

// import routes
const product_route = require("./routes/product_route");

const user_route = require("./routes/user_route");

app.use("/api/product",product_route);
app.use("/api/user",user_route);

app.get('/',(req,res) => {
	res.send("success");
})


app.listen(app.get('port'),function(){
	console.log(`App running on ${app.get('port')} & env is ${process.env.DB_CONF}`)
})