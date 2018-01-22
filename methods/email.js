// Mailgun mail content
const mailTestLink = 'https://www.w3schools.com/test/names.asp';

const sendVerificationMail = (userMail, storeName ,verification_code) => {
	const fromMail = 'dev@predator-digital.com';
	return {
		from: `Excited User <${fromMail}>`,
		to: `${userMail}`,
		subject: 'Verification mail',
		html: `Please use the below link to verify your email address
		<p>${mailTestLink}?email=${userMail}&autocode=${verification_code}&storeName=${storeName}</p>
		`
	};
};

const forgotPwdMail = (userMail) => {
	return {
		from: 'Excited User <harishkashaboina94@gmail.com>',
		to: `${userMail}`,
		subject: 'Forgot password',
		html: `<p>${mailTestLink}?emailid=${userMail}</p>`
	}
};

module.exports = {
	sendVerificationMail,
	forgotPwdMail
}