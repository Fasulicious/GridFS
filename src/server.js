import express, { json } from "express";
import path from 'path'
import methodOverride from "method-override";

// Import Routes
import api from './routes/index'

const app = express()

// Settings
app.set('port', process.env.PORT || 1337);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// Middleware
app.use(json())
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

// Use Routes
app.use(api)

export default app