const expressConfig = require('./express-config');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
 
class AppConfig{
    
    constructor(app){
        dotenv.config();
        this.app = app;
    }
 
    includeConfig() {
        this.app.use(
            bodyParser.json()
        );

        /* cors for removing cross origin errors */
        this.app.use(cors());        
        
        new expressConfig(this.app);
    }
 
}
module.exports = AppConfig;