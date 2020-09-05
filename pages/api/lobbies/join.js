import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'
import { ObjectId } from 'mongodb'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {

    const {lobbyId, player} = req.body

    await req.db.collection('lobbies').updateOne(
        { _id: ObjectId(lobbyId) },
        { $push: { players: player } }
    )

    res.status(200).json({ message: 'Player joined lobby' })
})

export default handler