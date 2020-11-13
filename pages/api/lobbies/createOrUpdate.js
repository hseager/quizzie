import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'
import fetch from 'isomorphic-unfetch'

const handler = nextConnect()

handler.use(middleware)

//TODO: create an ORM to save lobby class
handler.post(async (req, res) => {

    const { userId, quizId } = req.body
    const lobbiesCollection = req.db.collection('lobbies');

    let lobby = await lobbiesCollection.findOne({ owner: userId });

    if(!lobby){
        // Create Lobby if one doesn't exist
        const emptyLobby = {
            owner: userId,
            players: [],
            status: 'lobby',
            currentQuestion: 0,
            quizId,
            created: new Date()
        }

        const newLobby = await lobbiesCollection.updateOne(
            { owner: userId }, 
            { $set: emptyLobby }, 
            { upsert: true }
        )

        lobby = await lobbiesCollection.findOne({ _id: newLobby.result.upserted[0]._id })

        res.status(200).json({ lobbyId: lobby._id })
    } else {
        // Update Lobby if already exists
        await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/update`, {
            method: 'post',
            body: JSON.stringify({ 
                id: lobby._id,
                data: {
                    quizId
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        res.status(200).json({ lobbyId: lobby._id })
    }

})

export default handler