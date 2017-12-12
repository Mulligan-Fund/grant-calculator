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
    , LocalStrategy = require('passport-local')
    , mongoose = require('mongoose')
    , cors = require('cors');

app.set('view engine', 'jade');
app.use(morgan('dev'));  
app.use(bodyParser());
app.use(sessions({ secret: 'wowfoundations'
					 ,cookie:
					    { secure: false
					    , httpOnly: false } } ));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({credentials: true, origin: 'http://127.0.0.1:4000'}));
app.use(methodOverride());

// Mongoose
var schema = require('./schema.js');
var User = require('./user.js');
mongoose.connect('mongodb://localhost/grantcalc'); //process.env.MONGODB_URI || 

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
  if (req.isAuthenticated()) { console.log("Authenticated"); return next(); }
  else {
  	console.log("Not Authenticated");
	res.setHeader('Content-Type', 'application/json');	
	res.status(401).send(JSON.stringify("Not Logged In"))
  }
}

var heroku = process.env.HEROKU_TRUE || false

passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
  function(username, password, done) {
  	console.log("Looking for",username,password)
    User.findOne({ username: username }, function (err, user) {
    	console.log("Looking for user",user,err)
		if (err) { console.log(err); return done(err); }

		if (!user) { 
			console.log("Making user")
		     usr = new User({ username: username, password: password });
		     usr.save(function(err) {
			     if(err) {
			           console.log(err);
			     } else {
			           console.log('user: ' + usr.username + " saved.");
			     }
		  });

		}

		if(user) {
			if(user.password == password) {
				done(null,user)
			} else {
				return done(null,false, {message: 'Invalid password'});
			}
		}



		// TO IMPLEMENT
		// bcrypt.compare(pw, this.password, function(err, isMatch) {
		//   if (err) return done(err);
		//   if(isMatch) {
		//     return done(null, user);
		//   } else {
		//     return done(null, false, { message: 'Invalid password' });
		//   }
		// });

    });
  }
));

// Default return

app.options('*', cors()); // Setup CORS option

app.get('/', function(req,res) {
	res.setHeader('Content-Type', 'application/json');	
	res.send(JSON.stringify("No Login"))
})

app.put('/auth',
  passport.authenticate('local'),
  function(req, res) {
  	console.log("Punted through")
  	res.setHeader('Content-Type', 'application/json');	
	res.status(202).send(JSON.stringify("./list"))
});

function authenticationMiddleware() { 
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
		res.status(401).send(JSON.stringify("Not Logged In"))
	}
  }
}

// Main index
app.put('/',  ensureAuthenticated, function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');	
	res.send(JSON.stringify("Logged in"))
});

app.get('/login',  function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');	
	res.send(JSON.stringify("Error login"))
});


app.get('/logout',  function(req, res){
  req.logout();
  res.setHeader('Content-Type', 'application/json');	
  res.send(JSON.stringify("Error login"))
});

//////////////////////////////////
////////////// USER //////////////
//////////////////////////////////
app.get('/user', ensureAuthenticated,function(req,res,next){
	// Get User info here
	res.setHeader('Content-Type', 'application/json');	
	res.send(JSON.stringify("User info should return"))
})

app.put("/user", ensureAuthenticated,function(req,res,next){
	console.log("Updating user",req.query)
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

app.get('/grant', ensureAuthenticated, function(req, res, next) {
	var items = []
	console.log("req.user for /items",req.user)
	User.findById(req.user.id,function(err,user){
		console.log("/grant user",user)
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

app.put('/grant', ensureAuthenticated, function(req,res,next) {
	var items = []
	console.log("req.user for /items",req.user)
	User.findById(req.user.id,function(err,user){
		console.log("/grant user",user)
		if(err)  {
			console.log("Some kind of error fetching pins",err)
			res.sendStatus(400,err)
		}

		if(user.username == null) {
			res.sendStatus(400,err)	
		} else {
		console.log("Returned user",user)

		if (!user) { 
		     usr = new User({ username: username, password: password });
		     usr.save(function(err) {
			     if(err) {
			           console.log(err);
			     } else {
			           console.log('user: ' + usr.username + " saved.");
			     }
		  });

		}
		

		data = "FetchDataFrom"

		console.log("FULLDUMP",data)

		res.setHeader('Content-Type', 'application/json');	
    	res.send(JSON.stringify(items))
		}
	})
})

app.listen(port);
console.log('App running on port', port);