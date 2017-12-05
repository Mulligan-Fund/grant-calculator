var express = require('express')
	, connect = require('connect')
	, sessions = require('express-session')
    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , app = express()
    , port = process.env.PORT || 3000
    , router = express.Router()
    , passport = require('passport')
    , passport_local = require('passport-local')
    , mongoose = require('mongoose');

app.set('view engine', 'jade');
app.use(morgan('dev'));  
app.use(bodyParser());   
app.use(sessions({ secret: 'wowfoundations' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride());

// Mongoose
var schema = require('./schema.js');
var User = require('./user.js');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/grantcalc');


// STRAVA METHODS (Auth and passport)
passport.serializeUser(function(user, done) {
	console.log("serializeUser")
	console.log(user)
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

var heroku = process.env.HEROKU_TRUE || false

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd',
    passReqToCallback: true,
    session: false,
    callbackURL: "http://127.0.0.1:3000/auth/callback"
  }, function(accessToken, refreshToken, profile, done) {
  	console.log("user get!",accessToken,profile)
    User.findOneAndUpdate(
    		{id:profile.id}, 
    		{id:profile.id,
    			access_token: accessToken}, 
    		{upsert:true}, function(err, user) {
      if(err) {
        return done(err);
      } else {
        return done(null, user);
        console.log("Set user with id",profile.id,"and token",accessToken)
      }
    });
  }
));

app.get('/auth',
  passport.authenticate('local'));

app.get('/auth/callback', 
  passport.authenticate('local',
  	{ failureRedirect: '/login' }),
  function(req, res) {
  	 User.findOneAndUpdate(
		{id:req.user.id}, 
		{id:req.user.id,
		}, 
		{upsert:true}, function(err,user){
			if(err) {
				res.redirect('/logout')
			} else {
			    res.redirect('/');
			}
		})

});

function authenticationMiddleware() { 
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
}

// Main index
app.get('/', authenticationMiddleware(), function(req, res, next) {
	// console.log("Rendering index")
	console.log(req.session.pinid)
	console.log(req.session.pinboard)

	User.findOne({id:req.user.id}, function (err, user) {
	  if(err) {
	  	res.redirect('/login')
	  } else {
		  if(user.pin_username == null) {
	      	res.render('pin-auth');	
	      } else {
	      	res.render('index')
	      }	
	  }
      
    });
    // console.log(req.user)
});

app.get('/login', function(req, res, next) {
	// console.log(req.user)
    res.render('auth');
});


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//////////////////////////////////
////////////// USER //////////////
//////////////////////////////////
app.get('/user',ensureAuthenticated,function(req,res,next){
	// Get User info here
})

app.put("/user/update",ensureAuthenticated,function(req,res,next){
	console.log("Updating user",req.query)

	var update = function() {
	 	if(typeof req.query.yearly_goal !== "undefined") 
	 		return {yearly_goal:req.query.yearly_goal}
	 	else if(typeof req.query.monthly_budget !== "undefined")
	 		return {monthly_budget:req.query.monthly_budget}
 		else if(typeof req.query.pin_username !== "undefined") 
 			return {pin_username:req.query.pin_user}
		else if(typeof req.query.pin_board !== "undefined") 
			return {pin_board:req.query.pin_board}
		else {
			console.log("Nothin...",req.query)
			return {}
		}
	}

	console.log('updateQuery',update())

	User.findOneAndUpdate(
	{id:req.user.id}, 
		update(),
		{upsert:true}, function(err,user){
			if(err) {
				console.log("user update fail :(",err)
				res.sendStatus(500)
			} else {
				console.log("user update success",user)
				res.sendStatus(200)
			}
	})		
})



//////////////////////////////////////
/////////////  Items  ////////////////
//////////////////////////////////////

app.get('/items/claim',ensureAuthenticated,function(req,res,next){
	// console.log("req.user",req.user)
	// console.log("req.session",req.session)

	schema.findOneAndUpdate(

	// Loop through the dbfields and create approp
	{id:req.query.pinid}, 
		{userid: req.user._id,
		 stravaid: req.user.id,
		 pinid: req.query.pinid, 
		 link: req.query.link,
		 cost: req.query.cost,
		 img: req.query.img
		},
		{safe: true, upsert:true}, function(err,user){
			if(err) {
				console.log("claim fail :(",err)
				res.sendStatus(500)
			} else {
				console.log("Claim success",user)
				res.sendStatus(200)
			}
	})		
})


app.get('/items', ensureAuthenticated,function(req, res, next) {
	var items = []
	console.log("req.user for /items",req.user)
	User.findOne({id:req.user.id}, function(err,user) {
		console.log("/items user",user)
		if(err)  {
			console.log("Some kind of error fetching pins",err)
			res.sendStatus(400,err)
		}

		if(user.username == null) {
			res.sendStatus(400,err)	
		} else {
		console.log("Returned user",user)

		data = "FetchDataFrom"

		console.log("FULLDUMP",data)

		res.setHeader('Content-Type', 'application/json');	
    	res.send(JSON.stringify(items))
		}
	})
})

app.listen(port);
console.log('App running on port', port);