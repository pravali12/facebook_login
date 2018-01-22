const AWS = require("aws-sdk");
const config = require('./config');

AWS.config.update({
	"accessKeyId": config.ACCESS_KEY_ID,
	"secretAccessKey": config.SECRET_ACCESS_KEY,
	"region": "ap-south-1"
});

module.exports = AWS