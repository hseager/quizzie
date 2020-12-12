import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
    try{
        const { lobbyId } = req.query;
        const lobbyRequest = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/lobbies/${lobbyId}`)
        const lobby = await lobbyRequest.json()
        if(lobbyRequest.status !== 200)
            throw lobby.message
    
        let results = await req.db.collection('results').findOne(
            { 
                lobbyId,
                quizCount: lobby.quizCount
            }
        )
        if(!results)
            throw 'Results not found'
    
        res.status(200).json(results)
    } catch(err){
        res.status(500).json({ message: err })
    }
})

export default handler