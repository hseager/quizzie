import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

export default async function database(req, res, next) {
    if(!client.isConnected()) await client.connect()
    //req.dbCLient = client
    req.db = client.db(process.env.DB_NAME)
    return next()
}