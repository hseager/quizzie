import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {

    const { lobbyId, data } = req.body

    const doc = await req.db.collection('results').updateOne(
        { lobbyId }, 
        { $push: { results: data } }, 
        { upsert: false }
    )

    res.json({ message: 'ok' })
})

export default handler