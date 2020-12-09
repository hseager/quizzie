import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'
import { ObjectId } from 'mongodb'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {

    const { lobbyId } = req.query;
    const resultsCollection = req.db.collection('results');

    const lobby = await req.db.collection('lobbies').findOne({ _id: ObjectId(lobbyId) })

    let results = await resultsCollection.findOne(
        { 
            lobbyId, 
            currentQuiz: lobby.currentQuiz - 1
        }
    )

    res.status(200).json(results)

})

export default handler