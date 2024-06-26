const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()

const mongoose=require("mongoose")
mongoose.connect(process.env.MONGO_URL)

app.set('view engine','ejs')


const path= require("path")
app.use('/car',express.static(path.join(__dirname,'public')));

const userRoute = require("./routes/userRoute")
app.use('/', userRoute)

const adminRoute = require("./routes/adminRoute")
app.use('/admin', adminRoute)

app.use('*', (req, res) => {
    res.status(404).render(__dirname + '/views/users/404.ejs')
})

app.listen(process.env.PORT,()=>{
    console.log('running at',"http://localhost:3000/");
})