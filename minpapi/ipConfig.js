const titbit = require("titbit");
const crypto=require("crypto");


var app = new titbit();

var{router} = app;

router.get('/wx/msg',async c=>{
    var token = 'msgtalk';

    var urlargs = [
        c.query.nonce,  //随机数

        c.query.timestamp,  //时间戳

        token
    ];

    urlargs.sort(); //字典排序

    var onestr = urlargs.join('');  //拼接成一个字符串

    var sha1 =crypto.createHash('sha1');
    
    sha1.update(onestr);    //设置要进行加密处理的数据

    //如果加密后数据相同则返回随机字符串
    if(sha1.digest('hex') === c.query.signature){
        c.res.body = c.query.echostr;
    }
});

app.run(8004,'localhost');