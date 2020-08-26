import { MongoClient } from 'mongodb'
import nextConnect from 'next-connect'
import config from '../libs/config'

const client = new MongoClient(config.mongoDbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

async function database(req, res, next) {
    if(!client.isConnected()) await client.connect()
    req.dbCLient = client
    req.db = client.db(config.mongoDbName)
    return next()
}

const middleware = nextConnect()

middleware.use(database)

export default middleware