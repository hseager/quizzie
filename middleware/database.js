import { MongoClient } from 'mongodb'

const { DB_CONNECTION, DB_NAME } = process.env

let cached = global.mongo
if(!cached) cached = global.mongo = {}

export async function connectToDatabase() {
    if (cached.connection) return cached.connection.db
    if (!cached.promise) {
      let connection = {}
      cached.promise = MongoClient.connect(DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
        .then((client) => {
          connection.client = client
          return client.db(DB_NAME)
        })
        .then((db) => {
          connection.db = db
          cached.connection = connection
          return connection
        })
    }
    await cached.promise
    return cached.connection.db
}

export default async function database(req, res, next) {
    req.db = await connectToDatabase()
    return next()
}