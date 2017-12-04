var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var grantmakerSchema = new Schema({
	funder:text,
	past_grant:dropdown,
	amount:money,
	probability:percentage,
	new_or_renewal:dropdown,
	invited_or_unsolicited:dropdown,
	type_of_support:dropdown,
	type_of_application:dropdown,
	length_of_award:number,
	number_of_questions:number,
	site_visit:dropdown,
	loi:dropdown,
	number_of_reports:number,
});