import nextConnect from 'next-connect'
import middleware from '../../../middleware/middleware'
import slugs from 'slugs'
import randomize from 'randomize-array'
import fs from 'fs'

const handler = nextConnect()
handler.use(middleware)

function uploadImage(image, name, savePath){
    let webImagePath = ''
    if(image.size > 0){
        let imageName = ''
        if(image.type === 'image/jpeg')
            imageName = `${name}.jpg`
        else if(image.type === 'image/png')
            imageName = `${name}.png`
        else if(image.type === 'image/gif')
            imageName = `${name}.gif`
        else throw `File type not supported ${image.type}`

        webImagePath = `/img/quiz/${imageName}`
        const newPath = `${savePath}\\${imageName}`
        const rawData = fs.readFileSync(image.path)

        fs.writeFile(newPath, rawData, (err) => {
            if(err) throw err
        })
    }
    return webImagePath
}

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

        const imageUploadPath = `${process.cwd()}\\public\\img\\quiz`

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

            const image = req.files[`question-${i}-image`]
            let imagePath = ''
            if(typeof image !== 'undefined' && image.size > 0)
                imagePath = uploadImage(image, `${slug}-q-${i}`, imageUploadPath)

            questions.push({
                question: formData[`question-${i}`],
                answers,
                answer,
                image: imagePath
            })
            i++
        }

        const thumbnail = req.files.thumbnail
        const thumbnailName = `${slug}-thumbnail`
        let thumbnailPath = uploadImage(thumbnail, thumbnailName, imageUploadPath)

        const newQuiz = {
            title,
            author,
            type,
            difficulty,
            tags: (Array.isArray(tags) ? tags : [tags]),
            created: new Date(),
            questions,
            slug,
            image: thumbnailPath,
            played: 0
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