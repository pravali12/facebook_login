require('dotenv').config();

const dynogels = require('dynogels');
const config = require('./config');
const AWS = require("../config/aws-config");

const ddb = new AWS.DynamoDB();
dynogels.dynamoDriver(ddb);

module.exports = {
    dynogels,
    ddb
}