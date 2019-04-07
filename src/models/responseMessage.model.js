const {
    mongoose
} = require('../db/mongoose.config');

// ! creating schema for mobile
const messageSchema = new mongoose.Schema({
    fromUserId: {
        type: String
    },
    message: {
        type: String
    },
    toUserId: {
        type: String
    }
});
const messages = mongoose.model('messages', messageSchema);
module.exports = {
    messages
};