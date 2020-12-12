import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {
    try{
        const { lobbyId, quizId, quizCount, playerId, question, answer } = req.body
        const results = req.db.collection('results')

        // Check if a record has been created
        const recordCreated = await results.findOne(
            { 
                lobbyId,
                quizCount
            }
        )
        if(!recordCreated){
            await results.insertOne(
                {
                    lobbyId,
                    quizId,
                    quizCount,
                    results: []
                }
            )
        }
        
        // Check if player has already answered this question
        const alreadyAnsweredQuestion = await results.findOne(
            { 
                lobbyId,
                quizCount,
                'results.playerId' : playerId,
                'results.$.answers.question': question
            }
        )

        if(alreadyAnsweredQuestion) throw 'Player has already answered this question'

        // Check if player has previously answered a question
        const answeredBefore = await results.findOne(
            { 
                lobbyId,
                quizCount,
                'results.playerId' : playerId,
            }
        )
        if(!answeredBefore){
            // Create a new player record with answer
            await results.updateOne(
                {
                    lobbyId,
                    quizCount,
                },
                {
                    $push:{
                        results: {
                            playerId,
                            answers: [
                                { question, answer }
                            ]
                        }
                    }
                }
            )
        } else {
            // Add the latest answer
            await results.updateOne(
                {
                    lobbyId,
                    quizCount,
                    'results.playerId' : playerId,
                },
                {
                    $push:{
                        'results.$.answers': { question, answer }
                    }
                }
            )
        }

        res.status(200).json({ message: 'ok' })
    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

export default handler