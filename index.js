const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended:false})
const cookieParser = require('cookie-parser')
const MongoControl = require('./tools/databasecontrol').MongoControl
const page = new MongoControl('blog','page')
const comment = new MongoControl('blog','comment')
const ejs = require('ejs')
const moment = require('moment')

app.use(cookieParser())
app.use(express.static('./static',{
    index : false
}))

//后台功能接口
app.use('/admin',express.static('./static',{index : false}))
app.use('/admin',require('./router/admin'))


app.get('/',function(req,res){
    page.find({},function(err,data){
        ejs.renderFile('./ejs-tpl/index.ejs',{data:data},function(error,html){
            res.send(html)
        })
    })
})

app.get('/p',function(req,res){
    var _id = req.query._id
    //查询文章
    page.findById(_id,function(err,result){
        if(result.length == 0){
            res.status(404).send('不愿染是与非，怎料事与愿违')
            return
        }
        var data = result[0]
        comment.find({fid : _id, state : 1}, function(err,result){
            //渲染
            ejs.renderFile('./ejs-tpl/page.ejs',{data:data, comment : result},function(error,html){
                res.send(html)
            })
        })
    })
})
app.post('/submitComment',urlencodedParser,function(req,res){
    var _id = req.query._id
    var {email, content} = req.body
    if(!_id){
        res.send('不允许评论')
        return
    }
    if(!email || !content){
        res.send('不允许评论')
        return
    }
    comment.insert({
        fid : _id,
        author : email,
        content : content,
        date : moment().format('YYYY-MM-DD hh:mm:ss'),
        state : 0
    },(err,result)=>{
        if(err){
            res.status(500).send('服务器崩了!')
            return
        }
        res.redirect(
            '/p?_id=' + _id 
        )
    })
})


app.listen(3000)