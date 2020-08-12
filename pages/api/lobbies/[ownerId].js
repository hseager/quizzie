import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
    const { ownerId } = req.query;
    let lobby = await req.db.collection('lobbies').findOne({ owner: ownerId });

    // Create Lobby if one doesn't exist
    if(!lobby){
        const emptyLobby = { owner: ownerId, players: [] }
        lobby = await req.db.collection('lobbies').updateOne({ owner: ownerId }, {$set: emptyLobby}, { upsert: true })
    }
    
    res.json(lobby)
})

export default handler