const express = require('express')
const app = express()
const storageRouter = require('./routes/storage')
const dotenv = require('dotenv')

dotenv.config()

app.use(express.json())

app.get('/', (req,res) => {
    res.send('API is working')
})

app.use('/storage', storageRouter)

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`)
})