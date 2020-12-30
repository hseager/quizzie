import nextConnect from 'next-connect'
import middleware from '../../../middleware/middleware'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
    try{
        const { lobbyId } = req.query;
        const lobbyRequest = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/${lobbyId}`)
                                    .then(res => res.json())
                                    .catch(err => { throw err} )
        if(!lobbyRequest)
            throw 'Error retrieving lobby'
        
        if(lobbyRequest.status !== 200)
            throw lobbyRequest.message
        
        let results = await req.db.collection('results').findOne(
            { 
                lobbyId,
                quizCount: lobbyRequest.data.quizCount
            }
        )
        if(!results)
            throw 'Results not found'
    
        res.status(200).json(results)
    } catch(err){
        console.log(err)
        res.status(500).json({ message: err })
    }
})

export default handler