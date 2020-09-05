import nextConnect from 'next-connect'
import middleware from '../../../../middleware/database'
import { ObjectId } from 'mongodb'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {

    const { id } = req.query;
    const lobby = await req.db.collection('quizzes').findOne({ _id: ObjectId(id) });

    if(!lobby)
        res.status(404).json({ message: 'Quiz not found' })

    res.status(200).json(lobby)

})

export default handler