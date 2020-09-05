import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {

    const data = req.body
    let action = {}

    if(data.push)
        action = { $push: data.data }
    else 
        action = { $set: data.data }

    await req.db.collection('lobbies').updateOne(
        { owner: data.id }, 
        action, 
        { upsert: false }
    )

    res.json({ message: 'Lobby updated' })
})

export default handler