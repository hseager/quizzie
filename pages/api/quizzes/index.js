import nextConnect from 'next-connect'
import middleware from '../../../middleware/middleware'
import slugs from 'slugs'
import randomize from 'randomize-array'
import path from 'path'
import fs from 'fs'

const handler = nextConnect()
handler.use(middleware)

handler.get(async (req, res) => {
   try{
        const quizzes = await req.db.collection('quizzes').find({}).toArray()
        if(!quizzes || quizzes.length === 0)
            return res.status(404).json({ status: 404, message: 'Quizzes not found' })

        res.status(200).json({ status: 200, data: quizzes })
    } catch(err){
        console.log(err)
        res.status(500).json({ status: 500, message: err })
    }
})

handler.post(async (req, res) => {
    try{
        const formData = req.body
        const {title, author, type, difficulty, tags} = formData
        const questions = []
        let slug = slugs(title)

        const quizCollection = req.db.collection('quizzes')
        const quizzesWithSameTitle = await quizCollection.countDocuments({ title })
        if(quizzesWithSameTitle > 0) slug = slugs(`${title}-${quizzesWithSameTitle + 1}`)

        let i = 1
        while(formData[`question-${i}`]){
            let answers = [
                formData[`question-${i}-answer-1`],
                formData[`question-${i}-answer-2`],
                formData[`question-${i}-answer-3`],
                formData[`question-${i}-answer-4`],
            ]
            answers = randomize(answers)

            const answer = answers.findIndex(a => a === formData[`question-${i}-answer-1`])

            questions.push({
                question: formData[`question-${i}`],
                answers,
                answer
            })
            i++
        }

        const image = req.files.image
        let webImagePath = ''
        if(image){
            let imageName = ''
            if(image.type === 'image/jpeg')
                imageName = `${slug}.jpg`
            else if(image.type === 'image/png')
                imageName = `${slug}.png`
            else if(image.type === 'image/gif')
                imageName = `${slug}.gif`
            else throw `File type not supported ${image.type}`

            webImagePath = `/img/quiz/${imageName}`
            const newPath = `${process.env.FILEPATH}\\public\\img\\quiz\\${imageName}`
            const rawData = fs.readFileSync(image.path)
            
            fs.writeFile(newPath, rawData, (err) => {
                if(err) throw err
            })
        }

        const newQuiz = {
            title,
            author,
            type,
            difficulty,
            tags: (Array.isArray(tags) ? tags : [tags]),
            created: new Date(),
            questions,
            slug,
            image: webImagePath
        }

        quizCollection.insertOne(newQuiz)

        res.status(200).json({ status: 200 })
    } catch(err){
        console.log(err)
        res.status(500).json({ status: 500, message: err })
    }

})

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler