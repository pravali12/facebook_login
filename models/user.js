const Joi = require('joi');
const SchemaModel = require('../config/schema');

const tableName = `Merchant_details`;
//This is temporary we will remove optional parameters and enforce the schema after testing

const optionalParams = ['fullName','username','password','storeName','verification_code','verifiedornot'];
const userSchema = {
	hashKey: 'email',
	// rangeKey:'username',
	timestamps: true,
	schema: Joi.object({
		email: Joi.string().email(),
		fullName: Joi.string(),
		username: Joi.string().alphanum(),
		password: Joi.string().min(6), //here encrypted password is saved
		storeName: Joi.string(),
		verification_code:Joi.string(),
		verifiedornot: Joi.string()
	}).optionalKeys(optionalParams).unknown(true)
};
const User = SchemaModel(userSchema, {tableName: tableName});

module.exports = User;