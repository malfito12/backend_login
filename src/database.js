// const mongoose=require('mongoose')

// const URI= process.env.MONGODB_URI 
//     ? process.env.MONGODB_URI
//     : 'mongodb://localhost/databasetest'

// mongoose.connect(URI,{
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify:false
// })

// const connection=mongoose.connection
// connection.once('open',()=>{
//     console.log('DB is connected')
// })
// module.exports=mongoose;

const mongoose=require('mongoose')
const databasename='crud'
mongoose.connect("mongodb://127.0.0.1:27017/"+databasename,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})
const connection=mongoose.connection
connection.once('open',()=>{
    console.log('DB is connected')
})
module.exports=mongoose;