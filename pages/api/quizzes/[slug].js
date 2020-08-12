import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
    const { slug } = req.query;
    const doc = await req.db.collection('quizzes').findOne({ slug });
    res.json(doc)
})

export default handler