import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {

    const { lobbyId, quizId, currentQuiz, playerId, question, answer } = req.body

    try{
        const results = req.db.collection('results')
        // See if player has answered before
        const result = await results.findOne(
            { 
                lobbyId,
                currentQuiz,
                'results.playerId': playerId
            }
        )
        // Add player to results
        if(!result){
            await results.updateOne(
                { 
                    lobbyId,
                    quizId,
                    currentQuiz
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
        
        // Check if player has already answered

        const alreadyAnswered = await results.findOne(
            { 
                lobbyId,
                currentQuiz,
                'results.playerId': playerId,
                'results.answers.question': question
            }
        )

        if(!alreadyAnswered){
            results.updateOne(
                {
                    lobbyId,
                    currentQuiz,
                    'results.playerId': playerId,
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
        } else {
            throw 'Player has already answered'
        }
        res.status(200).json({ message: 'ok' })
    } catch(err){
        res.status(500).json(err)
    }
})

export default handler