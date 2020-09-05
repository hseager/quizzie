import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {

    const { lobbyId, data } = req.body

    await req.db.collection('results').updateOne(
        { lobbyId }, 
        { $push: { results: data } }
    )

    res.status(200).json({ message: 'ok' })
})

export default handler