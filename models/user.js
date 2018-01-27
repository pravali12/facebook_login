const Joi = require('joi');
const SchemaModel = require('../config/schema');


//This is temporary we will remove optional parameters and enforce the schema after testing

const optionalParams = ['fullName','username','password','verification_code','verifiedornot'];
const userSchema = {
	hashKey: 'email',
	// rangeKey:'username',
	timestamps: true,
	schema: Joi.object({
		email: Joi.string().email(),
		fullName: Joi.string(),
		username: Joi.string().alphanum(),
		password: Joi.string().min(6), //here encrypted password is saved
		verification_code:Joi.string(),
		verifiedornot: Joi.string()
	}).optionalKeys(optionalParams).unknown(true)
};

const attToGet = ['email', 'fullname', 'username', 'password'];
const attToQuery = ['email', 'fullname', 'username', 'password','verification_code','verifiedornot'];
const optionsObj = {
    attToGet,
	attToQuery,
};
const User = SchemaModel(userSchema, optionsObj);

module.exports = User;