"use strict";
/*requiring mongodb node modules */
const mongodb = require('mongodb');
const assert = require('assert');

class Db{

	constructor(){
		this.mongoClient = mongodb.MongoClient;
		this.ObjectID = mongodb.ObjectID;
		this.url = 'mongodb://localhost:27017';
	}

	onConnect(){
		const mongoURL = this.url;
		// const mongoURL = 'mongodb://localhost:27017';
		return new Promise( (resolve, reject) => {
			this.mongoClient.connect(mongoURL, (err, db) => {
				if (err) {
					console.log(err,'error');
					reject(err);
				} else {
					// console.log(db,'db');
					assert.equal(null, err);
					resolve([db,this.ObjectID]);
				}
			});
		});
	}
}
module.exports = new Db();