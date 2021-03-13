const express=require('express')
const cors=require('cors')
const app=express()

//seting
app.set('port', process.env.PORT || 4000)

//middleware
app.use(cors());
app.use(express.json());



//routes
var serviceRouter=require('./routes/service')
// app.use('/api/users',require('./routes/users'))
// app.use('/api/notes', require('./routes/notes'))


app.use('/service', serviceRouter)
module.exports=app;

