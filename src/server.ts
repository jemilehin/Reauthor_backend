const express = require('express')
var cors = require('cors')
const dotenv = require('dotenv');


import UserRouter from './routes/UserRoutes'
import PropertyRouter from './routes/PropertyRoutes'

// var corsOptions = {
//     origin: 'http://localhost:4200'
// }
dotenv.config()

const app = express();
app.use(cors())
app.use(express.json({limit: '1mb'}))
app.use(express.urlencoded({extended: true}))

app.use('/api', UserRouter)
app.use('/api/property', PropertyRouter)


const port = process.env.PORT

app.listen(port, () => console.log(`Sever is running on port--> ${port}`))