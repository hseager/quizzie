import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {

    const { userId, quizId } = req.body
    const lobbiesCollection = req.db.collection('lobbies');

    let lobby = await lobbiesCollection.findOne({ owner: userId });

    //TODO: create quiz then redirect 

    if(lobby){
        res.status(200).json(lobby)
    } else {
        res.status(404).json({ message: 'Lobby not found' })
    }
    
})

export default handler