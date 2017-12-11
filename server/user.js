var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var User = new Schema({
  username: String,
  password: String,
  ein: {type: String, default: 000000000}
});

// User.comparePassword = function(pw, cb) {  
//   bcrypt.compare(pw, this.password, function(err, isMatch) {
//     if (err) {
//       return cb(err);
//     }
//     cb(null, isMatch);
//   });
// };


module.exports = mongoose.model('users', User);