const mongoose = require('mongoose')

let conn = null

const URI = 'mongodb+srv://Deimos:GXPhGxHX1aguKYnV@cluster0.ltf7b.mongodb.net/secret?retryWrites=true&w=majority'

module.exports = async () => {
    if(!conn){
        conn = mongoose.connect(URI, {
            useNewUrlParser: true,
            useCreateIndex: true
        })

        await conn
    }
}