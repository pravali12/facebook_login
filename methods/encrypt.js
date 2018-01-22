const statusMsg = require('./statusMsg');
const bcrypt = require('bcryptjs');

const generateSalt = function (res,newpassword, userCallback) {
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			console.log(`\nmsg-1\n ${err.message}`);
			res.send(statusMsg.errorResponse(err));
		} else {
			bcrypt.hash(newpassword, salt, (err, hashnewpwd) => {
				if (err) {
					console.log(`\nmsg-2\n ${err.message}`);
					res.send(statusMsg.errorResponse(err));
				} else {
					userCallback(hashnewpwd);
				}
			})
		}
	})
}

module.exports = {
	generateSalt,
}