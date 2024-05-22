import express from 'express'
import { config } from 'dotenv'
import db_connection from './DB/db_connection.js'
import { globalResponse } from './src/middlewares/globalResponse.js'
import userRouter from './src/modules/user/user.router.js'
import companyRouter from './src/modules/company/company.router.js'
import jobRouter from './src/modules/job/job.router.js'
import applicationRouter from './src/modules/application/application.router.js'

config({path: './config/dev.config.env'})

let app = express()

let port = process.env.PORT

app.use(express.json())

app.use('/user', userRouter)
app.use('/company', companyRouter)
app.use('/job', jobRouter)
app.use('/application', applicationRouter)

app.use(globalResponse) 

db_connection()

app.listen(port, ()=> console.log("Project Is Working Fine"))