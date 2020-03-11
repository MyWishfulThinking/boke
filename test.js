const MongoControl = require('./tools/databasecontrol').MongoControl
const page = new MongoControl('blog','page')
const comment = new MongoControl('blog','comment')
const moment = require('moment')


// page.insert(
//     {
//        sort : 'JS',
//        title : 'JS太难了',
//        author :'纪庆涛',
//        date : moment().format('YYYY-MM-DD hh:mm:ss'),
//        content : '何当共剪西窗烛，却话巴山夜雨时',
//        intro : '格列佛游记'
//     },
//     ()=>{}
// )
comment.insert({
    fid : '5e461a5c64f8cd2108bfd896',
    content : '走遍天涯心随你起落',
    author : 'jiqingtao@qq.com',
    date :  moment().format('YYYY-MM-DD hh:mm:ss')
},()=>{})