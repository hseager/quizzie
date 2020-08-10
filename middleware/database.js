import { MongoClient } from 'mongodb'
import nextConnect from 'next-connect'

const client = new MongoClient('mongodb+srv://hseager:ctPKhL2svhvqjhZZ@cluster0.rqcx8.mongodb.net', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

async function database(req, res, next) {
    if(!client.isConnected()) await client.connect()
    req.dbCLient = client
    req.db = client.db('quizziedb')
    return next()
}

const middleware = nextConnect()

middleware.use(database)

export default middleware