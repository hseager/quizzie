import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()
handler.use(middleware)

handler.get(async (req, res) => {
   try{
        const quizzes = await req.db.collection('quizzes').find({}).toArray()
        if(!quizzes || quizzes.length === 0)
            return res.status(404).json({ status: 404, message: 'Quizzes not found' })

        res.status(200).json({ status: 200, data: quizzes })
    } catch(err){
        console.log(err)
        res.status(500).json({ status: 500, message: err })
    }
})

handler.post(async (req, res) => {
    try{
        const {title, author, type, difficulty, tags} = req.body

        const newQuiz = {
            title,
            author,
            type,
            difficulty,
            tags,
            created: new Date()
        }

        const quizCollection = req.db.collection('quizzes');
        // quizCollection.insertOne(newQuiz)

        console.log(req.body)

        res.status(200)
    } catch(err){
        console.log(err)
        res.status(500).json({ status: 500, message: err })
    }

 })

export default handler