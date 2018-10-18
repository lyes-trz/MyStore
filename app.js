


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//connect db

mongoose.connect("mongodb://localhost/ms");


// bootcamp get


app.get("/", function(rep, res){
	res.render("landing");
});

// schema setup

var productSchema = new mongoose.Schema({
	name: String,
	image : String,
	price: Number,
	s: Number,
	m: Number,
	xl: Number,
	xxl: Number
});

var Product = mongoose.model("Product", productSchema);

var orderSchema = new mongoose.Schema({
	image: String,
	product: String,
	price: Number,
	q: Number,
	size: String,
	fname: String,
	lname: String,
	email: String,
	tele: String,
	city: String
});

var Order = mongoose.model("Order", orderSchema);


// resful routes





app.get("/products", function(rep, res){

	Product.find({}, function(err, products){
		 if(err){
		 	res.redirect("/products");
		 }else{
		 	res.render("products", {products:products});
		 }
	});
	
});

app.get("/orders", function(rep, res){

	Order.find({}, function(err, orders){
		 if(err){
		 	res.redirect("/orders");
		 }else{
		 	res.render("orders", {orders:orders});
		 }
	});
	
});
// show route

app.get("/products/:id", function(req, res){
      Product.findById(req.params.id, function(err, foundProduct){
      	if(err){
      		res.redirect("/products");
      	}else{
      		res.render("buy", {product: foundProduct});
      	}
      })
});



// new route order

app.get("/products/:id", function(req, res){
	res.render("buy");
});

//create route order

app.post("/orders", function(req, res){
         // create order
         Order.create(req.body.order, function(err, newOrder){
         	if(err){
         		res.render("buy");
         	}else{
         		res.redirect("/orders");
         	}
         });
});


// edit route

app.get("/orders/:id/edit", function(req, res){
      Order.findById(req.params.id, function(err, foundOrder){
      	if(err){
      		res.redirect("/orders");
      	}else{
      		res.render("edit", {order: foundOrder});
      	}
      })
});

// update
app.put("/orders/:id", function(req, res){
      Order.findByIdAndUpdate(req.params.id, req.body.order, function(err, updateOrder){
      	if(err){
      		res.redirect("/orders");
      	}else{
      		res.redirect("/orders");
      	}
      });
});

//delet route
app.delete("/orders/:id", function(req, res){
    // destroy
    Order.findByIdAndRemove(req.params.id, function(err){
      	if(err){
      		res.redirect("/orders");
      	}else{
      		res.redirect("/orders");
      	}
      });
});



app.listen(process.env.PORT, process.env.IP, function(){
	console.log("MyStore server has started")
})





app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
