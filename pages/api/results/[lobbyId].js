import nextConnect from 'next-connect'
import middleware from '../../../middleware/database'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {

    const { lobbyId } = req.query;
    const resultsCollection = req.db.collection('results');

    let results = await resultsCollection.findOne({ lobbyId });

    res.status(200).json(results)

})

export default handler