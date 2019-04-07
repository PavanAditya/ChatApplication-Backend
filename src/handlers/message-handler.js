const {
	messages
} = require('../models/responseMessage.model');
const CONSTANTS = require('./../config/constants');

const getMessagesRouteHandler = async (request, response) => {
	let userId = request.body.userId;
	let toUserId = request.body.toUserId;
	if (userId == '') {
		response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
			error: true,
			message: CONSTANTS.USERID_NOT_FOUND
		});
	} else {
		const data = {
			'$or': [{
				'$and': [{
					'toUserId': userId
				}, {
					'fromUserId': toUserId
				}]
			}, {
				'$and': [{
					'toUserId': toUserId
				}, {
					'fromUserId': userId
				}]
			}, ]
		};
		try {
			const messagesResponse = await messages.find(data).sort({
				'timestamp': 1
			});
			response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
				error: false,
				messages: messagesResponse
			});
		} catch (error) {
			console.log(error, 'error');
			response.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
				error: true,
				messages: CONSTANTS.USER_NOT_LOGGED_IN
			});
		}
	}
}

module.exports = getMessagesRouteHandler;