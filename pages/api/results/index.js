import nextConnect from 'next-connect'
import middleware from '../../../middleware/middleware'

const handler = nextConnect()
handler.use(middleware)

handler.post(async (req, res) => {
    try{
        const { lobbyId, quizId, quizCount } = req.body
        const collection = req.db.collection('results');
    
        let results = await collection.findOne(
            { 
                lobbyId,
                quizId,
                quizCount
            }
        );
        if(!results){
            // Create Results if they don't exist
            const newResults = {
                lobbyId,
                quizId,
                quizCount,
                results: []
            }
            collection.updateOne(
                {
                    lobbyId,
                    quizId,
                    quizCount
                },
                { $set: newResults }, 
                { upsert: true }
            )
        }
        res.status(200).json({ status: 200, message: 'ok' })
    } catch(err){
        console.log(err)
        res.status(500).json({ status: 500, message: err })
    }
})

export default handler