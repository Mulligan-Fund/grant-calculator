var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var grantmakerSchema = new Schema({
	funder : String,
	past_grant : String,
	amount : Number,
	probability : Number,
	new_or_renewal : String,
	invited_or_unsolicited : String,
	type_of_support : String,
	type_of_application : String,
	length_of_award : Number,
	number_of_questions : Number,
	site_visit : String,
	loi : String,
	number_of_reports : Number,
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/peddler-test');
module.exports = mongoose.model('db', grantmakerSchema);
