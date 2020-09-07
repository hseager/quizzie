import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'
import { ObjectId } from 'mongodb'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {

    const {id, data} = req.body

    await req.db.collection('lobbies').updateOne(
        { _id: ObjectId(id) },
        { $set: data }
    )

    res.status(200).json({ message: 'Lobby updated' })
})

export default handler