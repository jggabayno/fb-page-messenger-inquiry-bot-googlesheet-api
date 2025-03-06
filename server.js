import express from 'express'
import cors from 'cors'
import chatbotRouter from "./routes/chatbotRouter.js"
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use('/images', express.static('public/images'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())

app.get('/', (_, res) => res.send('running...'))
app.use('/webhook', chatbotRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.info(`Running on PORT ${PORT}`))