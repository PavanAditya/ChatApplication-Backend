const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/local';
const urlParser = {
    useNewUrlParser: true
};
mongoose.set('useCreateIndex', true);
mongoose.connect(url, urlParser)
    .catch(err => {
        return err;
    });
module.exports = { mongoose };
