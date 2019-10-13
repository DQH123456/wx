const titbit = require('titbit');
const crypto = require('crypto');
const xmlparse = require("xmlparse");

var app = new titbit();

var {router} = app;

router.get('/wx/msg', async c => {
    var token = 'msgtalk';

    var urlargs = [
        c.query.nonce,
        c.query.timestamp,
        token
    ];

    urlargs.sort();  //字典排序

    var onestr = urlargs.join(''); //拼接成字符串
    
	//生成sha1签名字符串
    var hash = crypto.createHash('sha1');
    var sign = hash.update(onestr);
		
    if (c.query.signature === sign.digest('hex')) {
        c.res.body = c.query.echostr;
    }
});

router.post('/wx/msg',async c =>{

    try{
        //console.log(try);
        let data =await new Promise((rv,rj)=>{
            xmlparse(c.body,{explicitArray:false},(err,result)=>{
                if(err){
                    rj(err);
                }else{
                    rv(result.xml);
                }
            });
        });
        //如果
if(data.MsgType !=='text'){
    return;
}
//按照公众平台开发文档格式格式化消息字符
let retText = `
    <xml>
        <FormUserName>${data.ToUserName}</FormUserName>
        <ToUserName>${data.FromUserName}</ToUserName>
        <MsgType><![CDATA[text]]></MsgType>
        <Content>${data.Content}</Content>
        <CreateTime>${parseInt(Date.now()/1000)}</CreateTime>
    </xml>
    `;
    c.res.body = retText        //返回消息
    }catch(err){
        console.log(err);
    }
});

app.run(8004, 'localhost');
