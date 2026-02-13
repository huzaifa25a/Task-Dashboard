const mongo = require('mongoose');

const user = mongo.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {timestamps: true})

module.exports = mongo.model('User', user);