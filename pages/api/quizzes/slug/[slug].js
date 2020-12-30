import nextConnect from 'next-connect'
import middleware from '../../../../middleware/middleware'

const handler = nextConnect()
handler.use(middleware)

handler.get(async (req, res) => {
    try{
        const { slug } = req.query;

        const quiz = await req.db.collection('quizzes').findOne({ slug })
        if(!quiz)
            return res.status(404).json({ status: 404, message: 'Quiz not found' })

        res.status(200).json({ status: 200, data: quiz })
    } catch(err){
        console.log(err)
        res.status(500).json({ status: 500, message: err })
    }
})

export default handler