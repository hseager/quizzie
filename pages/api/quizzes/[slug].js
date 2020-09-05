import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
    const { slug } = req.query;
    const quiz = await req.db.collection('quizzes').findOne({ slug });

    res.status(200).json(quiz)
})

export default handler