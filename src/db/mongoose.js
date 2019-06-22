const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).catch((error) => {
    console.log('Error connecting to the database.', error.message)
    process.exit(error.statusCode)
})