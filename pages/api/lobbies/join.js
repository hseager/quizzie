import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {
    let data = req.body
    let doc = await req.db.collection('lobbies').updateOne({ owner: data.owner }, { $push: { players: data.player } }, { upsert: false })
    
    res.json({ message: 'ok' })
})

export default handler