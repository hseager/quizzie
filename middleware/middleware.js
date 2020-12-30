import nextConnect from 'next-connect'
import database from './database'
import parseMultipartForm from './multipart-form-parser'

const middleware = nextConnect()
middleware.use(database)
middleware.use(parseMultipartForm)

export default middleware