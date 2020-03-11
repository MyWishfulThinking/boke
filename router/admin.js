const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended:false})
const MongoControl = require('../tools/databasecontrol').MongoControl
const moment = require('moment')
const path = require('path')

const CookieControl = require('../cookie')

var admin = new CookieControl()

const page = new MongoControl('blog','page')
const comment = new MongoControl('blog','comment')

const token = '123$#$%123sdfhy*&^%'

router.get('/',function(req,res){
    if(admin.checkToken(req.cookies.token)){
        res.sendFile(
            path.resolve('./static/admin.html')
        )
    }else{
        res.redirect('/admin/login')
    }
})

router.get('/login',function(req,res){
    res.sendFile(
        path.resolve('./static/login.html')
    )
})

router.post('/login',urlencodedParser,function(req,res){
    if(req.body.username == 'admin' && req.body.password == 'admin'){
        // res.redirect('/admin')
        res.cookie('token',admin.getToken())
        // res.send('登陆成功!')
        res.redirect('/admin')
    }else{
        res.status(403).send('登陆失败')
    }
})

router.post('/uploadPage',urlencodedParser,function(req,res){

    if(admin.checkToken(req.cookies.token)){

    }else{
        res.status(403).send('你莫得权限nei')
        return
    }


    var {sort,title,author,content,intro} = req.body
    var now = moment().format('YYYY-MM-DD hh:mm:ss')
    page.insert({
        sort : sort,
        title : title,
        author : author,
        content : content,
        intro : intro,
        date : now
    },()=>{
        res.send('文章发表成功!')
    })
})
//评论相关接口
router.get('/getComment',function(req,res){
    if(admin.checkToken(req.cookies.token)){

    } else {
        res.status(404).send('你莫有权限nei')
        return
    }
    comment.find({state : 0},function(error,data){
        if(data.length == 0){
            res.send([])
            return
        }
        var count = 0
        for(var i = 0; i < data.length; i++){
            var nowData = data[i]
            var nowDataFid = nowData.fid
            page.findById(nowDataFid,function(error,result){
                var page = result[0]
                nowData.f_title = page.title
                nowData.f_intro = page.intro
                count++
                if(count == data.length){
                    res.send(data)
                }
            })
        }
    })
})
router.get('/passComment',function(req,res){
    if(admin.checkToken(req.cookies.token)){

    } else {
        res.status(404).send('你莫有权限nei')
        return
    }
    var _id = req.query._id
    comment.updateById(_id,{state:1},function(error,result){
        res.send(
            {
                result : 'ok'
            }
        )
    })
})
router.get('/nopassComment',function(req,res){
    // res.setHeader('Access-Control-Allow-Origin','*')
    if(admin.checkToken(req.cookies.token)){

    } else {
        res.status(404).send('你莫有权限nei')
        return
    }
    var _id = req.query._id
    comment.updateById(_id,{state:2},function(error,result){
        res.send(
            {
                result : 'ok'
            }
        )
    })
})

module.exports = router