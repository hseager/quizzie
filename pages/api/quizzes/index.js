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
        res.status(500).json({ status: 500, message: err })
    }
})

export default handler