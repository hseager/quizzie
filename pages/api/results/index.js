import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {

    const { lobbyId, quizId } = req.body

    const doc = await req.db.collection('results').updateOne(
        { lobbyId }, 
        { $set: 
            {
                lobbyId,
                quizId,
                results: []
            }
        }, 
        { upsert: true }
    )

    res.json({ message: 'ok' })
})

export default handler