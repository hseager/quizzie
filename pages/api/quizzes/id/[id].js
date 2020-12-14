import nextConnect from 'next-connect'
import middleware from '../../../../middleware/database'
import { ObjectId } from 'mongodb'

const handler = nextConnect()
handler.use(middleware)

handler.get(async (req, res) => {
    try{
        const { id } = req.query

        if(!ObjectId.isValid(id))
            return res.status(400).json({ status: 400, message: 'Invalid ID format' })
    
        const quiz = await req.db.collection('quizzes').findOne({ _id: ObjectId(id) })
        if(!quiz)
            return res.status(404).json({ status: 404, message: 'Quiz not found' })
    
        res.status(200).json({ status: 200, data: quiz })
    } catch(err){
        res.status(500).json({ status: 500, message: err })
    }
})

export default handler