import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()
handler.use(middleware)

handler.get(async (req, res) => {
   try{
        const tags = await req.db.collection('tags').find({}).toArray()
        if(!tags || tags.length === 0)
            return res.status(404).json({ status: 404, message: 'Tags not found' })

        res.status(200).json({ status: 200, data: tags })
    } catch(err){
        console.log(err)
        res.status(500).json({ status: 500, message: err })
    }
})

export default handler