const router = require('express').Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomstring = require("randomstring");

const config = require('../../config/config');
const User = require('../../models/user');
const Storename = require('../../models/storename');

const encrypt = require('../../methods/encrypt');
const sendMail = require('../../methods/email');
const statusMsg = require('../../methods/statusMsg');

var tableName = require('../../config/table');

// console.log(tableName);
const mailgun = require('mailgun-js')({
	apiKey: config.API_KEY_MAILGUN,
	domain: config.DOMAIN
});

router.get('/', (req, res) => {
	res.send('This is the api home route for User management');
})

//Login
router.post('/login', (req, res) => {
	const bodyParams = req.body;
	console.log('bodyParams: ', bodyParams);
	const userEmail = bodyParams.email;
	User.selectTable('Merchant_details');
	User.getItem(userEmail, {}, (err, user) => {
		console.log('user: ', user);
		if (err) {
			res.send(statusMsg.errorResponse(err));
		} else if (Object.keys(user).length === 0) {
			res.send(statusMsg.incorrectResponse('user'));
		}
		const hashPassword = user.password;
		bcrypt.compare(bodyParams.password, hashPassword, (err, result) => {
			if (err) {
				res.send(statusMsg.errorResponse(err));
			}
			if (result) {
				console.log(result);
				/*const token_info = {
					token: jwt.sign({
						email: `${userEmail}`,
						storeName: `${user.storeName}`,
						exp: Math.floor(Date.now() / 1000) + (60 * 60)
					}, config.SECRET_KEY)
				};*/
				token= jwt.sign({
					email: `${userEmail}`,
					storeName: `${user.storeName}`,
					exp: Math.floor(Date.now() / 1000) + (60 * 60)
				}, config.SECRET_KEY)
				res.send({ status: 'Successfully logged in!', token: token });
			} else {
				res.send(statusMsg.incorrectResponse('password'));
			}
		})
	})
});

//Signup
router.post('/signup', (req, res) => {
	const bodyParams = req.body;
	console.log('bodyParams: ', bodyParams);
	const name = bodyParams.storeName;
	const userEmail=bodyParams.email;
	if (bodyParams.password !== bodyParams.cpassword) {
		res.send(`Password doesn't match`);
	}
	//select table before
	 Storename.selectTable('store_details');
	 Storename.getItem(name, {}, (err, name) => {
		console.log(name, err);
		if (err) {
			return res.send(statusMsg.errorResponse(err))
		} if (Object.keys(name).length === 0) {
			console.log('storename',name);
			User.selectTable('Merchant_details');
	        User.getItem(userEmail, {}, (err, user) => {
				console.log(user, err);
				if (err) {
					return res.send(statusMsg.errorResponse(err))
				} if (Object.keys(user).length === 0) {
					console.log('user',user);
					//res.send(user)
					const createCallback = (hashnewpwd) => {
						const verification_code = randomstring.generate();
						const putParams = {
							"email": userEmail,
							"username": bodyParams.username,
							"storeName": bodyParams.storeName,
							"password": hashnewpwd,
							"verification_code": verification_code,
							"verifiedornot": 'no',
						};
						console.log("Adding a new item...\n", putParams);
						User.createItem(putParams, { overwrite: false }, (err, user) => {
							if (err) {
								res.send(statusMsg.errorResponse(err));
							} else {
								console.log('\nAdded\n', user);

								const params = {"storeName": bodyParams.storeName };
								Storename.createItem(params, { overwrite: false }, (err, name) => {
									if (err) {
										res.send(statusMsg.errorResponse(err));
									} else {
										console.log('\nAdded\n', name);
										// const verification_code = randomstring.generate();
								const mailData = sendMail.sendVerificationMail(userEmail,bodyParams.storeName, verification_code);
								mailgun.messages().send(mailData, (err, body) => {
									if (err) {
										res.send(statusMsg.errorResponse(err));
										console.log('err: ', err);
									} else {
										res.send({
											status: "success",
											message: "email sent to your mailid"
										});
									}
								});
									}
								});
							}
						});
					}
					encrypt.generateSalt(res, bodyParams.password, createCallback);
					
				}
				if (Object.keys(user).length > 0) {
					res.send({
						status: 'failure',
						message: 'emailId already taken'
					})
				}
	       })
		}
		if (Object.keys(name).length > 0) {
			res.send({
				status: 'failure',
				message: 'storename already taken'
			})
		}
	})
});

//Signup Verification
router.post('/signupverification', (req, res) => {
	const bodyParams = req.body;
	console.log(bodyParams);
	const userEmail = bodyParams.email;
	User.selectTable('Merchant_details');
	User.getItem(userEmail, {}, (err, user) => {
		console.log('email checking');
		console.log(bodyParams.email);
		if (err) {
			console.log('\nerr', err);
			// console.log('');
			res.send(statusMsg.errorResponse(err));
		} else if (Object.keys(user).length === 0) {
			console.log('\nNo user');
			res.send({
				status: 'failure',
				message: 'EmailId and token do not match'
			})
		} else if (Object.keys(user).length > 0) {
			console.log('In Signup verification');
			console.log(user.verification_code, req.body.verification_code);
			if (user.verification_code === req.body.verification_code) {
				const updateParams = {
					email: userEmail,
					verifiedornot: 'yes'
				}
				console.log("Updating the item...");
				User.updateItem(updateParams, {}, (err, data) => {
					if (err) {
						res.send(statusMsg.errorResponse(err));
						console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
					} else {
						console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));

						var res1 = tableName.tempcreateTables(req.body.storeName, {
						}, (err, table) => {
							if (err) {
								console.log(err);
							} else {
								console.table("this is " + table);
							}
						});
						res.send(statusMsg.verifySuccess)
					}
				});
			} else {
				res.send({
					status: 'failure',
					message: 'auth code is not correct'
				});
			}
		}
	})
});

// Forgot Password
router.post('/forgotpwd', (req, res) => {
	const userEmail = req.body.email;
	const dataToSend = sendMail.forgotPwdMail(userEmail);
	mailgun.messages().send(dataToSend, (error, body) => {
		if (error) {
			res.send(statusMsg.errorResponse(err));
		} else {
			console.log("email sent");
			// return done(null, { userDetails: params.Item, message: 'email send to your mail' });
			res.send({
				status: "success",
				message: "email sent to your mailid"
			});
		}
	})
});

// Update Password
router.post('/updatepwd', (req, res) => {
	const bodyParams = req.body;
	const userEmail = bodyParams.email;
	User.selectTable('Merchant_details');
	User.getItem({ email: userEmail }, {}, (err, user) => {
		console.log('email checking');
		console.log(Object.keys(user).length);
		// const hashPassword = user.Item.password;
		if (err) {
			res.send(statusMsg.errorResponse(err));
		} else if (Object.keys(user).length === 0) {
			res.send(statusMsg.incorrectResponse('user'));
		} else {
			const updateCallback = function (hashnewpwd) {
				const updateParams = {
					email: userEmail,
					password: hashnewpwd
				};
				console.log("Updating the item...");
				//User.selectTable('Merchant_details');
				User.updateItem(updateParams, {}, (err, data) => {
					if (err) {
						res.send(statusMsg.errorResponse(err));
						console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
					}
					console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
					res.send({
						status: 'success',
						message: 'updated successfully'
					})

				});

			};
			encrypt.generateSalt(res, bodyParams.newpassword, updateCallback);
		}

	});
});

// Reset password
router.post('/resetpwd', (req, res) => {
	const bodyParams = req.body;
	const userEmail = bodyParams.email;
	User.selectTable('Merchant_details');
	User.getItem(userEmail, {}, (err, user) => {
		console.log('email checking', Object.keys(user).length);
		if (err) {
			res.send(statusMsg.errorResponse(err));
		} else if (Object.keys(user).length === 0) {
			res.send(statusMsg.incorrectResponse('user'));
		}
		const hashPassword = user.password;
		console.log(hashPassword)
		bcrypt.compare(bodyParams.password, hashPassword, (err, result) => {
			if (err) {
				console.log('\nerr: ', err);
				res.send(statusMsg.errorResponse(err));
			} else if (result) {
				console.log('\nresult: ', result);
				// var token_info = {token: jwt.sign({ email: 'harishkashaboina94@gmail.com', exp: Math.floor(Date.now() / 1000) + (60 * 60)}, 'cadenza')};
				const updateCallback = (hashnewpwd) => {
					const updateParams = {
						"email": userEmail,
						"password": hashnewpwd
					};
					User.updateItem(updateParams, {}, (err, data) => {
						if (err) {
							res.send(statusMsg.errorResponse(err))
							console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
						}
						console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
						res.send(statusMsg.verifySuccess)
					});
				}
				encrypt.generateSalt(res, bodyParams.newpassword, updateCallback);
			} else {
				res.send(statusMsg.incorrectResponse('password'));
			}
		})

	});
});

module.exports = router;