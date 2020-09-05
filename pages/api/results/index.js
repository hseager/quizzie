import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {

    const { lobbyId, quizId } = req.body

    await req.db.collection('results').updateOne(
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

    res.status(200).json({ message: 'ok' })
})

export default handler