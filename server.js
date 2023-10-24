const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express();

const port = 4000

app.listen(port, () => console.log(`Sever is running on port--> ${port}`))