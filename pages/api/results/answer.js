import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {

    const { lobbyId, quizId, playerId, question, answer } = req.body

    try{

        const results = req.db.collection('results')
        // See if player has answered before
        const result = await results.findOne(
            { 
                lobbyId,
                quizId,
                'results.playerId': playerId
            }
        )

        if(!result){
            await results.updateOne(
                { 
                    lobbyId,
                    quizId
                }, 
                {
                    $addToSet: { 
                        results: {
                            playerId,
                            answers: []
                        }
                    }
                },
                {
                    upsert: true
                }
            )
        }
        
        await results.updateOne(
            {
                lobbyId,
                quizId,
                'results.playerId': playerId
            },
            {
                $push: {
                    'results.$.answers': {
                        question,
                        answer
                    }
                }
            }
        )
    } catch(e){
        console.log('Error: ' + e)
    }

    res.status(200).json({ message: 'ok' })
})

export default handler