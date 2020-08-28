import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {

    const { ownerId } = req.query;
    const lobbiesCollection = req.db.collection('lobbies');

    let lobby = await lobbiesCollection.findOne({ owner: ownerId });

    // Create Lobby if one doesn't exist
    if(lobby) {
        res.json(lobby)
    } else {
        const emptyLobby = { 
            owner: ownerId, 
            players: [],
            status: 'lobby',
            currentQuestion: 0
        }

        const result = await lobbiesCollection.updateOne(
            { owner: ownerId }, 
            { $set: emptyLobby }, 
            { upsert: true }
        )

        lobby = await lobbiesCollection.findOne({ _id: result.result.upserted[0]._id })

        res.json(lobby)
    }
    
})

export default handler