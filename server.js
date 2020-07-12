const express = require('express')
const app = express()
const mongouri = require('./config/config')
const path = require('path')

const mongoose = require('mongoose')

const startMongo = async () => {
    try {
        await mongoose.connect(mongouri.mongouri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Mongo has been started')
    } catch (e) {
        console.log(e)
    }
}
startMongo()

app.use(express.json({ extended: true }))

app.use('/t', require('./routes/redirect'))
app.use('/auth', require('./routes/auth'))
app.use('/link', require('./routes/link'))


app.use('/', express.static(path.join(__dirname, 'client', 'build')))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server has been started on ${PORT}`))