var mongoose= require('../database')
var BOOKSCHEMA={
    bookname: String,
    author: String,
    description: String,
    
}

const BOOK=mongoose.model('book', BOOKSCHEMA)
module.exports=BOOK
