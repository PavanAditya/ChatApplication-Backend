const helper = require('./../handlers/query-handler');
const CONSTANTS = require('./../config/constants');
const passwordHash = require('./../utils/password-hash');
const mongodb = require('mongodb');

'use strict';
class RouteHandler {

	routeNotFoundHandler(request, response) {
		response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
			error: true,
			message: CONSTANTS.ROUTE_NOT_FOUND
		});
	}

	async registerRouteHandler(request, response) {
		const data = {
			username: (request.body.username).toLowerCase(),
			password: request.body.password
		};
		if (data.username === '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error: true,
				message: CONSTANTS.USERNAME_NOT_FOUND
			});
		} else if (data.password === '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error: true,
				message: CONSTANTS.PASSWORD_NOT_FOUND
			});
		} else {
			try {
				// console.log(data);
				data.online = 'Y';
				data.socketId = '';

				data.password = passwordHash.createHash(data.password);

				const result = await helper.registerUser(data);
				// console.log(result);
				if (result === null || result === undefined) {
					response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
						error: false,
						message: CONSTANTS.USER_REGISTRATION_FAILED
					});
				} else {
					response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
						error: false,
						userId: result.insertedId,
						message: CONSTANTS.USER_REGISTRATION_OK
					});
				}
			} catch (error) {
				response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
					error: true,
					message: CONSTANTS.SERVER_ERROR_MESSAGE
				});
			}
		}
	}

	async userNameCheckHandler(request, response){
		const username = request.body.username;
		if (username === "") {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERNAME_NOT_FOUND
			});
		} else {
			try {
				const count = await helper.userNameCheck( {
					username : username.toLowerCase()
				});
				if (count > 0) {
					response.status(200).json({
						error : true,
						message : CONSTANTS.USERNAME_AVAILABLE_FAILED
					});
				} else {
					response.status(200).json({
						error : false,
						message : CONSTANTS.USERNAME_AVAILABLE_OK
					});
				}
			} catch ( error ){
				response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
					error : true,
					message : CONSTANTS.SERVER_ERROR_MESSAGE
				});
			}
		}
	}

	async loginRouteHandler(request, response){
		const data = {
			username : (request.body.username).toLowerCase(),
			password : request.body.password
		};
		if(data.username === '' || data.username === null) {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERNAME_NOT_FOUND
			});
		}else if(data.password === '' || data.password === null){
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.PASSWORD_NOT_FOUND
			});
		}else{
			try {
				const result = await helper.getUserByUsername(data.username);
				if(result ===  null || result === undefined) {
					response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
						error : true,
						message : CONSTANTS.USER_LOGIN_FAILED
					});
				} else {
					if( passwordHash.compareHash(data.password, result.password) ){
						await helper.makeUserOnline(result._id);
						response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
							error : false,
							userId : result._id,
							message : CONSTANTS.USER_LOGIN_OK
						});
					} else {
						response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
							error : true,
							message : CONSTANTS.USER_LOGIN_FAILED
						});
					}                   
				}
			} catch (error) {
				response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
					error : true,
					message : CONSTANTS.USER_LOGIN_FAILED
				});
			}
		}
	}

	async userSessionCheckRouteHandler(request, response){
		let userId = request.body.userId;
		// console.log(userId)
		if (userId === '') {
			response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERID_NOT_FOUND
			});
		}else{
			try {
				const result = await helper.userSessionCheck({ userId });
				response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
					error : false,
					username : result.username,
					message : CONSTANTS.USER_LOGIN_OK
				});
			} catch ( error ) {
				response.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
					error : true,
					message : CONSTANTS.USER_NOT_LOGGED_IN
				});
			}
		}
	}

	// getMessagesRouteHandler = async (request, response) => {
	// 	let userId = request.body.userId;
	// 	let toUserId = request.body.toUserId;           
	// 	if (userId == '') {
	// 		response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
	// 			error : true,
	// 			message : CONSTANTS.USERID_NOT_FOUND
	// 		});
	// 	}else{
	// 		try {

	// 			const data = {
	// 				'$or': [{
	// 					'$and': [{
	// 						'toUserId': userId
	// 					}, {
	// 						'fromUserId': toUserId
	// 					}]
	// 				}, {
	// 					'$and': [{
	// 						'toUserId': toUserId
	// 					}, {
	// 						'fromUserId': userId
	// 					}]
	// 				}, ]
	// 			};
	// 			// const mongoClient = mongodb.MongoClient;
	// 			// const mongoURL = 'mongodb://localhost:27017';
	// 			// new Promise( (resolve, reject) => { 

	// 			// 	await mongoClient.connect(mongoURL, {
	// 			// 	useNewUrlParser: true
	// 			// }, (err, client) => {
	// 			// 	if (err) {
	// 			// 		// console.log(err, 'error');
	// 			// 		// return err;
	// 			// 		reject(err);
	// 			// 	} else {
	// 			// 		var datab = client.db('local')
	// 			// 		datab.collection('messages').find

	// 			const {
	// 				messages
	// 			  } = require('../models/responseMessage.model');
	// 			const messagesResponse = await messages.find(data).sort({
	// 						'timestamp': 1
	// 					}).toArray((err, result) => {
	// 						client.close();
	// 						if (err) {
	// 							// return err;
	// 							return err;
	// 						}
	// 						// return result;
	// 						return result;
	// 					});
				
	// 			// helper.getMessages({
	// 			// 	userId: userId,
	// 			// 	toUserId: toUserId
	// 			// });
	// 			console.log(messagesResponse, 'rtgyh');
	// 			response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
	// 				error : false,
	// 				messages : messagesResponse
	// 			});
	// 		} catch ( error ){
	// 			console.log(error, 'error');
	// 			response.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
	// 				error : true,
	// 				messages : CONSTANTS.USER_NOT_LOGGED_IN
	// 			});
	// 		}
	// 	}
	// }

}


module.exports = new RouteHandler();