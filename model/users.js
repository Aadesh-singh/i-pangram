const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    visiblePass: String,
    userType: {
        type: String,
        enum: ['mentor', 'employee'],
        default: 'employee'
    }
});

module.exports = mongoose.model('User', userSchema);