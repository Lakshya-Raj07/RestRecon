const express = require('express')
const cors = require('cors')
const scanRouter = require('./routes/scan')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/scan', scanRouter)

app.listen(5000, () => {
    console.log('[*] RestRecon backend running on port 5000')
})