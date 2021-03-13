var mongoose= require('../database')
var USERSCHEMA={
    username: String,
    password: String,
    email: String,
    registerdate: Date,
    sexo: String,
    rols: Array
}

const USER=mongoose.model("user", USERSCHEMA)
module.exports={USER, keys: ["username","password","email","sexo"]}
