//Error and success messages
const errorResponse = (err) => {
	return {
		status: 'Error',
		errorDescription: err
	}
};

const incorrectResponse = (value) => {
	return {
		status: 'Failure',
		message: `Incorrect ${value}`
	}
};

const verifySuccess = {
	status: 'success',
	message: 'verified successfully'
};

module.exports = {
	errorResponse,
	incorrectResponse,
	verifySuccess
}