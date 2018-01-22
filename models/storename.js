const Joi = require('joi');
const Schema = require('../config/schema');

const tableName = `store_details`;
const storeSchema = {
	hashKey: 'storeName',
	// rangeKey:'username',
	timestamps: true,
	schema: Joi.object({
		storeName: Joi.string(),
        //merchant_id:Joi.string()
	}).unknown(true) //we will only allow unknown values in development
};
const Storename = Schema(storeSchema, {tableName:tableName});

module.exports = Storename;

//hash key - storename/emailid