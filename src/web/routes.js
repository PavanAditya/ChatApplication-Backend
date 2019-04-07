'use strict';

const routeHandler = require('./../handlers/route-handler');

const getMessagesRouteHandler = require('../handlers/message-handler');

class Routes{

	constructor(app){
		this.app = app;
	}

	/* creating app Routes starts */
	appRoutes(){
		this.app.get('*', routeHandler.routeNotFoundHandler);
		this.app.post('/register', routeHandler.registerRouteHandler); // ! not needed
		this.app.post('/usernameAvailable', routeHandler.userNameCheckHandler); // ! not needed
		this.app.post('/login', routeHandler.loginRouteHandler); // ! not needed
		this.app.post('/userSessionCheck', routeHandler.userSessionCheckRouteHandler); // ? needed
		this.app.post('/getMessages', getMessagesRouteHandler);	// ? most needed
	}

	routesConfig(){
		this.appRoutes();
	}
}

module.exports = Routes;