const database = require('./database');

const dynogels = database.dynogels;
const ddb = database.ddb; //this is the dynamodb method obtained from aws-sdk

// const tableName = require('./config').TABLE_NAME;

const Joi = require('joi');
// let tableCreated = false;
// // Creating a table is an async operation
function createTables(tableName,callback) {
    const tableSettings = {};
    tableSettings[tableName] = { //default settings for the table
        readCapacity: 5,
        writeCapacity: 1
    }
    dynogels.createTables(tableSettings, (err) => {
    if (err) {
        console.log('Error creating table: ', err);
    } else {
        console.log('Table has been created');
        callback(true);
    }
});
};

function tempcreateTables(tableName,optionsObj,callback) {
   // schema 

   var customerDetails = dynogels.define(tableName+"_customer_details", {
    hashKey : 'merchantid',
      rangeKey : 'shopid',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps : true,
  
    schema : {
     merchantid : Joi.string(),
     shopid:Joi.string(),
      email  : Joi.string().email(),
      firstname   : Joi.string(),
      lastname   : Joi.string(),
      gender : Joi.string(),
      password   : Joi.string(),
      home : {
              "address-line-1" : Joi.string(),
              "address-line-2": Joi.string(),
              mobile: Joi.string(),
              city: Joi.string(),
              state: Joi.string(),
              country: Joi.string(),
              "zip-code" : Joi.string()
          }
      }
});

var storedata = dynogels.define(tableName+"_store_data", {
    hashKey : 'collectionType',
      rangeKey : 'collectionId',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps : true,
    
    schema : {
        collectionType: Joi.string(),
        collectionId: Joi.string(),
      title  : Joi.string(),
      description   : Joi.string(),
      price   : Joi.string(),
      imageurl : Joi.string(),
      category   : Joi.string(),
      dimensions : Joi.string(),
      weight   : Joi.string(),
     }
});



var cartdata = dynogels.define(tableName+"_cart_data", {
    hashKey : 'cart_id',
      rangeKey : 'user_id',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps : true,

    schema : {
      cart_id  : Joi.string(),
      user_id   : Joi.string(),
      cart_items   : Joi.string(),
      totalquantity : Joi.number(),
      totalprice : Joi.number(),
      totalplans : Joi.number(),
      totalweight: Joi.number(),
      requesttype : Joi.string(),
      subscription_config : Joi.string()
     }
});


var sessiondata = dynogels.define(tableName+"_session_data", {
    hashKey : 'session_id',
      
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps : true,

    schema : {
      cart_data  : Joi.string(),
      cookies   : Joi.string(),
      flash_messages   : Joi.string(),
      dates : Joi.number(),
      session_id : Joi.number()
     }
});


var orderdata = dynogels.define(tableName+"_order_data", {
    hashKey : 'order_id',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps : true,

    schema : {
      order_id  : Joi.string(),
      order_details   : Joi.string(),
      payment_type   : Joi.string(),
      payment_status : Joi.string(),
      refund_status : Joi.string(),
      replacement_status : Joi.string(),
      cancel_status: Joi.string(),
      delivery_address : Joi.string(),
      delivery_status : Joi.string()
     }
});

    var tableSettings = {};
    tableSettings = { //default settings for the table
        customerDetails : { readCapacity: 10, writeCapacity: 2},
        storedata : { readCapacity: 10, writeCapacity: 2},
        cartdata : { readCapacity: 10, writeCapacity: 2},
        sessiondata : { readCapacity: 10, writeCapacity: 2},
        orderdata : { readCapacity: 10, writeCapacity: 2}
    }
    dynogels.createTables(tableSettings, (err) => {
    if (err) {
        console.log('Error creating table: ', err);
    } else {
        console.log('Table has been created');
        callback(true);
    }
});
};

//Check if the table exists
function checkTableState(tablename, statusCallback) {
    statusCallback = statusCallback || console.log;
    // let status = false;
    ddb.describeTable({ TableName: tablename }, (err, response) => {
        if (err) {
            console.log('err:', 'Table not found');
            statusCallback(false);
        }
        else {
            console.log(`${tablename} is the active table`);
            statusCallback(true)
        }
    });
};

function checkAndCreateTable(tableName, callback) {
    callback = callback || console.log;
    checkTableState(tableName, exists =>{
        if(!exists){
            createTables(tableName,done => {
               if (done) {
                   console.log(`Created the table: ${tableName}`);
                  callback();
               }
           });
       } else {
           console.log(`Table:'${tableName}' is active`);
           callback();
       }
    })
};

module.exports = {
    tempcreateTables,
    // tableName,
    checkTableState,
    createTables,
    checkAndCreateTable
}