import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'
import { ObjectId } from 'mongodb'

const handler = nextConnect()
handler.use(middleware)

handler.get(async (req, res) => {
    try{
        const { id } = req.query

        if(!ObjectId.isValid(id)) 
            return res.status(400).json({ status: 400, message: 'Invalid ID format' })

        const lobby = await req.db.collection('lobbies').findOne({ _id: ObjectId(id) })
        if(!lobby)
            return res.status(404).json({ status: 404, message: 'Lobby not found' })

        res.status(200).json({ status: 200, data: lobby })
    } catch(err){
        res.status(500).json({ status: 500, message: err })
    }
})

handler.patch(async (req, res) => {
    try{
        const { id } = req.query
        const { data } = req.body

        if(!ObjectId.isValid(id)) 
            return res.status(400).json({ status: 400, message: 'Invalid ID format' })

        if(!data)
            return res.status(400).json({ status: 400, message: 'Data not found' })

        await req.db.collection('lobbies').updateOne(
            { _id: ObjectId(id) },
            { $set: data }
        )

        res.status(200).json({ status: 200, message: 'Lobby updated' })
    } catch(err){
        res.status(500).json({ status: 500, message: err })
    }
})

export default handler