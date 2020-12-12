import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'
import { ObjectId } from 'mongodb'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
    try{
        const { id } = req.query
        if(ObjectId.isValid(id)){
            const lobby = await req.db.collection('lobbies').findOne({ _id: ObjectId(id) })
            if(!lobby){
                res.status(404).json({ message: 'Lobby not found' })
            } else {
                res.status(200).json(lobby)
            }
        } else {
            res.status(404).json({ message: 'Lobby not found' })
        }
    } catch(err){
        res.status(500).json({ message: `Error getting lobby: ${err}` })
    }
})

export default handler