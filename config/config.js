require('dotenv').config();

module.exports = {
    API_KEY_MAILGUN : process.env.API_KEY_MAILGUN,
    MAILGUN_DOMAIN : process.env.MAILGUN_DOMAIN,
    ACCESS_KEY_ID :process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY:process.env.SECRET_ACCESS_KEY,
    STORE_NAME:process.env.STORE_NAME,
    TABLE_NAME:process.env.TABLE_NAME,
    SECRET_KEY:process.env.SECRET_KEY
};