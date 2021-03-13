const express=require("express")
const router= express.Router()
const USEROBJET= require('../Models/user')
var KEYS = USEROBJET.keys
const USER=USEROBJET.USER



var crypto = require('crypto')
var jwt= require('jsonwebtoken')
const keycypher= "password123456"

// router.post("/user",async(req, res, next)=>{
//     let params=req.body
//     var docs= await USER.find({username: params.username, email: params.email})
//     if(docs.length>=1){
//         res.status(300).json({
//             "msn": "nombre de usuario invalido y de correo"
//         })
//     }

//     params["registerdate"]= new Date()
//     params["rols"]=['usuario']
//     let user= new USER(params)
//     user.save().then(()=>{
//         res.status(200).json(params)
//     })
// })

router.post("/user",async(req, res, next)=>{
    let params=req.body
    var docs= await USER.find({username: params.username, email: params.email})
    if(docs.length>=1){
        res.status(300).json({
            "msn": "nombre de usuario invalido y de correo"
        })
        return
    }

    params["registerdate"]= new Date()
    params["rols"]=['usuario']
    if(params.password==null){
        res.status(300).json({
            "msn": "no tiene el passowrd"
        })
        return
    }
    //hash de password
    params["password"]= crypto.createHash('md5').update(params.password).digest('hex')
    let user= new USER(params)
    user.save().then(()=>{
        res.status(200).json(params)
    })
})

router.get('/user', (req,res,next)=>{
    var params =req.query
    var SKIP=0;
    var LIMIT=100;
    var order=1;
    var filter={}
    if(params.skip){
        SKIP=parseInt(params.skip)
    }
    if(params.limit){
        LIMIT=parseInt(params.limit)
    }
    if(params.order){
        order=parseInt(params.order)
    }
    if(params.username){
        filter["username"]=params.username
    }
    if(params.id){
        filter["_id"]=params.id
    }
    if(params.email){
        filter["email"]=params.email
    }
    if(params.search){
        var regularexpresion= new RegExp(params.search, "g")
        filter["username"]=regularexpresion
    }
    USER.find(filter).skip(SKIP).limit(LIMIT).sort({username:order}).exec((err, docs)=>{
        if(err){
            res.status(200).json({
                "msm":"error en la base de datos"
            })
            return;
        }
        res.status(200).json(docs)
    })
})

router.delete('/user',(req, res, next)=>{
    var params=req.query
    if(params.id==null){
        res.status(300).json({
            "msm":"faltan paramtros"
        })
        return;
    }
    USER.deleteOne({_id: params.id},(err, docs)=>{
        if(err){
            res.status(300).json({
                "msm":"no se logro borrar el dato"
            })
            return;
        }
        res.status(200).json(docs)
        return;
    })
})
router.patch('/user',(req,res,next)=>{
    var params=req.query
    var data= req.body
    if(params.id==null){
        res.status(300).json({
            "msm":"faltan paramtros"
        })
        return;
    }
    var objkeys=Object.keys(data)
    for(var i=0;i<objkeys.length;i++){
        if(!checkKeys(objkeys[i])){
            res.status(300).json({
                "msm":"tus parametros son incorrectos"+ objkeys[i]
            })
            return;
        }
    }
    USER.updateOne({_id: params.id},data).exec((err,docs)=>{
        res.status(300).json(docs)
    })
    

})
function checkKeys(key){
    for(var j=0;j<KEYS.length;j++){
        if(key==KEYS[j]){
            return true
        }
    }
    return false
}

router.post('/login', (req, res, next)=>{
    var params= req.body;
    var passwordcyper=crypto.createHash('md5').update(params.password).digest('hex')
    USER.find({email: params.email, password: passwordcyper}).exec((err,docs)=>{
        if(err){
            res.status(300).json({
                "msn": "problemas con la DB"
            })
            return;
        }
        if(docs.length == 0){
            res.status(300).json({
                'msn': "Usuario y pass incporrecto"
            })
            return;
        }else{
            //creacion del token
            jwt.sign({name: params.email, password: passwordcyper}, keycypher, (err, token)=>{
                if(err){
                    res.status(300).json({
                        "msn": "error con jwt"
                    })
                    return
                }
                res.status(200).json({
                    "token": token
                })
                return
            })

        }
    })
})

function verytoken(req,res,next){
    const header = req.headers['authorization'];
    if(header==null){
      res.status(300).json({
        'msn':'no tiene el permiso'
      })
      return
    }
    req.token=header;
    jwt.verify(req.token, keycypher,(err, authData)=>{
      if(err){
        res.status(403).json({
          'msn':'Token incorrecto'
        })
        return;
      }
      
      res.status(403).json(authData)
    })
  }

module.exports= router