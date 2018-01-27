const router = require('express').Router();
const randomstring = require("randomstring");
const config = require('../../config/config');

const passport=require('../../config/passport');


router.get("/",function(req,res){
	   res.render("login");
	  //res.send("please login");
})
router.get("/login",isLoggedIn,function(req,res){
	  var json=JSON.stringify(req.user);
      console.log("login user: "+json);
	  res.redirect("http://pravali.serverless9.com");
})

//Login
router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));

// Authentication check	
router.get('/auth/facebook/callback',passport.authenticate('facebook', {
                    successRedirect : '/login',
                    failureRedirect : '/'
}));

// Logout
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
	  return next();
	}
	//res.send("login");
	res.redirect('/');
  }

module.exports = router;
