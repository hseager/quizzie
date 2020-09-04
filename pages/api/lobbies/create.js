import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {

    const data = req.body

    //TODO: create quiz then redirect 
    console.log(data)

    res.json({ message: 'ok' })
})

export default handler