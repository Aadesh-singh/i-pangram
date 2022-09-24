const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    requirements: {
        text: {
            type: String
        },
        time: {
            type: Date
        }
    },
    start: Date,
    end: Date,
    documents: [
        {
            type: String
        }
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    tech: [
        {
            type: String
        }
    ]
});




module.exports = mongoose.model('Project', projectSchema);
