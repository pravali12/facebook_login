const  authConfig = require('./auth');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
//dynamodb connection
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const encrypt = require('../methods/encrypt');
const statusMsg = require('../methods/statusMsg');
const config = require('../config/config');
const Methods = require('../methods/custom');

passport.serializeUser(function(user, done) {
    // done(null, user.id);
    console.log("serialize: "+user);
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    // Users.findById(obj, done);
    console.log("deserialize: "+obj);
    done(null, obj);
  });

  passport.use(new FacebookStrategy({

    clientID        : authConfig.facebook.clientID,
    clientSecret    : authConfig.facebook.clientSecret,
    callbackURL     : authConfig.facebook.callbackURL,
    profileFields: ['id', 'emails', 'name']

  },function(accessToken, refreshToken, profile, done) {
      var json=JSON.stringify(profile);
      console.log("profile: "+json);
      var profile=JSON.parse(json);

              process.nextTick(function() {
                const userEmail=profile.emails[0].value;
                const tableName="pravallika_user_data";
                User.selectTable(tableName);
                User.getItem(userEmail, {}, (err, user) => {
                  console.log(user, err);
                  if (err) {
                    //return res.send(statusMsg.errorResponse(err))
                    return done(err);
                  } if (Object.keys(user).length === 0) {
                    console.log('user',user);
                    //res.send(user)
                      const putParams = {
                        "email": userEmail,
                        "username": profile.name.givenName,
                        
                      };
                      console.log("Adding a new item...\n", putParams);
                      //User.selectTable(tableName);
                      User.createItem(putParams, { overwrite: false,tableName:tableName }, (err, user) => {
                        if (err) {
                          res.send(statusMsg.errorResponse(err));
                        } else {
                          console.log('\nAdded\n', user);
                          return done(null, putParams);  
                        }
                      });
                    
                    
                    
                  }
                  if (Object.keys(user).length > 0) {
                    return done(null, user);
                  }
            })

               

            });
    }
));  


module.exports = passport;
