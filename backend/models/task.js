const mongo = require('mongoose');

const tasks = mongo.Schema({
    title: {type: String, required: true},
    description: {type: String},
    tags: {type: String},
    status: {type: String, enum: ['In-Progress', 'Completed']},
    createdBy: {
        id: {type: String, required: true},
        name: {type: String, required: true},
        email: {type: String, required: true}
    }
}, {timestamps: true})

module.exports = mongo.model('Tasks', tasks);