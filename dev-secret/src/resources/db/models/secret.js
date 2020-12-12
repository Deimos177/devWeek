const mongoose = require('mongoose')

const schema = {
    owner: String,
    ownerEmail: String,
    adminKey: String,
    externalId: String,
    participants: [{
        _id: false,
        externalId: String,
        email: String,
        name: String,
    }],
    drawResults: [{
        _id: false,
        giver: String,
        receiver: String,
    }]
}

module.exports = mongoose.model('secret', schema)