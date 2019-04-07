// 'use strict';
const mongodb = require('mongodb');

class QueryHandler {

	constructor() {
		this.Mongodb = require("./../config/db");
		this.mongoClient = mongodb.MongoClient;
		this.ObjectID = mongodb.ObjectID;
		this.url = 'mongodb://localhost:27017';
	}

	registerUser(data) {
		return new Promise(async (resolve, reject) => {
			try {
				// const mongoURL = process.env.DB_URL;
				const mongoURL = this.url;
				this.mongoClient.connect(mongoURL, {
					useNewUrlParser: true
				}, (err, client) => {
					if (err) {
						// console.log(err, 'error');
						reject(err);
					} else {
						var datab = client.db('local')
						datab.collection('users').insertOne(data, (err, result) => {
							client.close();
							if (err) {
								reject(err);
							}
							resolve(result);
						});
					}
				})
			} catch (error) {
				reject(error)
			}
		});
	}

	userNameCheck(data) {
		return new Promise(async (resolve, reject) => {
			try {
				// console.log(data)
				// const [DB, ObjectID] = await this.Mongodb.onConnect();
				const mongoURL = this.url;
				this.mongoClient.connect(mongoURL,{
					useNewUrlParser: true
				}, (err, client) => {
					if (err) {
						// console.log(err, 'error');
						reject(err);
					} else {
						var datab = client.db('local')
						datab.collection('users').find(data).count((error, result) => {
							client.close();
							if (error) {
								reject(error);
							}
							resolve(result);
						});
					}
				})
			} catch (error) {
				reject(error)
			}
		});
	}

	getUserByUsername(username) {
		return new Promise(async (resolve, reject) => {
			try {
				// const [DB, ObjectID] = await this.Mongodb.onConnect();
				const mongoURL = this.url;
				this.mongoClient.connect(mongoURL, {
					useNewUrlParser: true
				}, (err, client) => {
					if (err) {
						// console.log(err, 'error');
						reject(err);
					} else {
						var datab = client.db('local')
						datab.collection('users').find({
							username: username
						}).toArray((error, result) => {
							client.close();
							if (error) {
								reject(error);
							}
							resolve(result[0]);
						});
					}
				})
			} catch (error) {
				reject(error)
			}
		});
	}

	makeUserOnline(userId) {
		return new Promise(async (resolve, reject) => {
			try {
				// const [DB, ObjectID] = await this.Mongodb.onConnect();
				const mongoURL = this.url;
				this.mongoClient.connect(mongoURL, {
					useNewUrlParser: true
				}, (err, client) => {
					if (err) {
						// console.log(err, 'error');
						reject(err);
					} else {
						var datab = client.db('local')
						datab.collection('users').findAndModify({
							_id: this.ObjectID(userId)
						}, [], {
							"$set": {
								'online': 'Y'
							}
						}, {
							new: true,
							upsert: true
						}, (err, result) => {
							client.close();
							if (err) {
								reject(err);
							}
							resolve(result.value);
						});
					}
				})
			} catch (error) {
				reject(error)
			}
		});
	}

	userSessionCheck(data) {
		return new Promise(async (resolve, reject) => {
			try {
				// const [DB, ObjectID] = await this.Mongodb.onConnect();
				const mongoURL = this.url;
				this.mongoClient.connect(mongoURL, {
					useNewUrlParser: true
				}, (err, client) => {
					if (err) {
						reject(err);
					} else {
						// console.log(this.ObjectID(data.userId),'userId')
						var datab = client.db('local');
						datab.collection('users').findOne({
							_id: this.ObjectID(data.userId),
							online: 'Y'
						}, (err, result) => {
							client.close();
							if (err) {
								// console.log(err, 'error');
								reject(err);
							}
							// console.log(result, 'result');
							resolve(result);
						});
					}
				})
			} catch (error) {
				reject(error)
			}
		});
	}

	addSocketId({
		userId,
		socketId
	}) {
		const data = {
			id: userId,
			value: {
				$set: {
					socketId: socketId,
					online: 'Y'
				}
			}
		};
		return new Promise(async (resolve, reject) => {
			try {
				// const [DB, ObjectID] = await this.Mongodb.onConnect();
				const mongoURL = this.url;
				this.mongoClient.connect(mongoURL, {
					useNewUrlParser: true
				}, (err, client) => {
					if (err) {
						// console.log(err, 'error');
						reject(err);
					} else {
						var datab = client.db('local')
						datab.collection('users').update({
							_id: this.ObjectID(data.id)
						}, data.value, (err, result) => {
							client.close();
							if (err) {
								reject(err);
							}
							resolve(result);
						});
					}
				})
			} catch (error) {
				reject(error)
			}
		});
	}

	getUserInfo({
		userId,
		socketId = false
	}) {
		let queryProjection = null;
		if (socketId) {
			queryProjection = {
				"socketId": true
			}
		} else {
			queryProjection = {
				"username": true,
				"online": true,
				'_id': false,
				'id': '$_id'
			}
		}
		return new Promise(async (resolve, reject) => {
			try {
				// const [DB,ObjectID] = await this.Mongodb.onConnect();
				const mongoURL = this.url;
				this.mongoClient.connect(mongoURL, {
					useNewUrlParser: true
				}, (err, client) => {
					if (err) {
						// console.log(err, 'error');
						reject(err);
					} else {
						var datab = client.db('local')
						datab.collection('users').aggregate([{
							$match: {
								_id: this.ObjectID(userId)
							}
						}, {
							$project: queryProjection
						}]).toArray((err, result) => {
							client.close();
							if (err) {
								reject(err);
							}
							socketId ? resolve(result[0]['socketId']) : resolve(result);
						});
					}
				})
			} catch (error) {
				reject(error)
			}
		});
	}

	getChatList(userId) {
		return new Promise(async (resolve, reject) => {
			try {
				// const [DB,ObjectID] = await this.Mongodb.onConnect();
				const mongoURL = this.url;
				this.mongoClient.connect(mongoURL, {
					useNewUrlParser: true
				}, (err, client) => {
					if (err) {
						// console.log(err, 'error');
						reject(err);
					} else {
						var datab = client.db('local')
						datab.collection('users').aggregate([{
							$match: {
								'socketId': {
									$ne: userId
								}
							}
						}, {
							$project: {
								"username": true,
								"online": true,
								'_id': false,
								'id': '$_id'
							}
						}]).toArray((err, result) => {
							client.close();
							if (err) {
								reject(err);
							}
							resolve(result);
						});
					}
				})
			} catch (error) {
				reject(error)
			}
		});
	}

	logout(userID, isSocketId) {
		// console.log(isSocketId)
		const data = {
			$set: {
				online: 'N'
			}
		};
		// console.log(data)
		return new Promise(async (resolve, reject) => {
			try {
				// const [DB, ObjectID] = await this.Mongodb.onConnect();
				const mongoURL = this.url;
				this.mongoClient.connect(mongoURL, {
					useNewUrlParser: true
				}, (err, client) => {
					if (err) {
						// console.log(err, 'error');
						reject(err);
					} else {
						let condition = {};
						if (isSocketId) {
							condition.socketId = userID;
						} else {
							condition._id = this.ObjectID(userID);
						}
						var datab = client.db('local')
						datab.collection('users').update(condition, data, (err, result) => {
							client.close();
							if (err) {
								reject(err);
							}
							resolve(result);
						});
					}
				})
			} catch (error) {
				reject(error)
			}
		});
	}

	getMessages({
		userId,
		toUserId
	}) {
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
		return new Promise(async (resolve, reject) => {
			try {
				// const [DB, ObjectID] = await this.Mongodb.onConnect();
				const mongoURL = this.url;
				await this.mongoClient.connect(mongoURL, {
					useNewUrlParser: true
				}, (err, client) => {
					if (err) {
						// console.log(err, 'error');
						reject(err);
					} else {
						var datab = client.db('local')
						datab.collection('messages').find(data).sort({
							'timestamp': 1
						}).toArray((err, result) => {
							client.close();
							if (err) {
								reject(err);
							}
							resolve(result);
						});
					}
				})
			} catch (error) {
				reject(error)
			}
		});
	}

	insertMessages(messagePacket) {
		return new Promise(async (resolve, reject) => {
			try {
				// const [DB, ObjectID] = await this.Mongodb.onConnect();
				const mongoURL = this.url;
				this.mongoClient.connect(mongoURL, {
					useNewUrlParser: true
				}, (err, client) => {
					if (err) {
						// console.log(err, 'error');
						reject(err);
					} else {
						var datab = client.db('local')
						datab.collection('messages').insertOne(messagePacket, (err, result) => {
							client.close();
							if (err) {
								reject(err);
							}
							resolve(result);
						});
					}
				})
			} catch (error) {
				reject(error)
			}
		});
	}

}

module.exports = new QueryHandler();