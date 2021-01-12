import nextConnect from 'next-connect'
import middleware from '../../../middleware/middleware'

const handler = nextConnect()
handler.use(middleware)

handler.post(async (req, res) => {
    try{
        const { playerId, quizId } = req.body
        const lobbiesCollection = req.db.collection('lobbies');
    
        let lobby = await lobbiesCollection.findOne({ owner: playerId });
        if(!lobby){
            // Create Lobby if one doesn't exist
            const emptyLobby = {
                owner: playerId,
                players: [],
                status: 'lobby',
                currentQuestion: 0,
                quizCount: 0,
                quizId: quizId,
                created: new Date()
            }
    
            const newLobby = await lobbiesCollection.updateOne(
                { owner: playerId }, 
                { $set: emptyLobby }, 
                { upsert: true }
            )
    
            lobby = await lobbiesCollection.findOne({ _id: newLobby.result.upserted[0]._id })
            
            res.status(200).json({ lobbyId: lobby._id, status: 'created' })
        } else {
            // Update Lobby if already exists
            res.status(200).json({ lobbyId: lobby._id, status: 'updated' })
        }
    } catch(err){
        console.log(err)
        res.status(500).json({ status: 500, message: err })
    }
})

export default handler