// 在Cloud code里初始化express框架
var express = require('express');
var app = express();

// App全局配置
app.set('views','cloud/views');   //设置模板目录
app.set('view engine', 'ejs');    // 设置template引擎
app.use(express.bodyParser());    // 读取请求body的中间件

//================= Weibo ================
var weibo = require('weibo');

var appkey = '795541860';
var secret = '02f10f98f7c62bc49b60424035dcf5a1';
var oauth_callback_url = 'http://127.0.0.1:8080/user/bind/weibo';
weibo.init('weibo', appkey, secret, oauth_callback_url);


var http= require('http');

function getPosts (userid,from,callback) {
    var url="http://api.weibo.com/2/statuses/user_timeline.json?count=20&source="+appkey+"&uid="+userid+"&since_id="+from;
    console.log(url);

    http.get(url, function(res) {
        console.log('STATUS: ' + res.statusCode);
    
        var pageData = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            pageData += chunk;
        });

        res.on('end', function(){
            var statuses=JSON.parse(pageData)['statuses'];
            var origs=[];
            for (var i = 0; i < statuses.length; i++) {
                var item=statuses[i];
                var orig=item['retweeted_status'];

                if (!orig) {continue;};

                var pid=orig['idstr'];
                var text=orig['text'];
                var type=0; //0:出售 1:求购 2:删除
                
                var query = new AV.Query('Post').equalTo('wbid',pid);
                console.log(query);

                query.first({
                    success: function(result) {
                        console.log(result);
                    }
                });

                if (text.indexOf('此微博已被作者删除')>0) {
                    //TODO: 从数据库中标记为已交易 (Travis 13-10-13 16:44)

                    continue;
                }else{
                    //TODO: 判断是否已经存在数据库中 (Travis 13-10-13 17:36)
                    


                    //删除@的多个微博账号
                    var delReg=/@[^ $]+/g;
                    text=text.replace(delReg,"");

                    //删除所有空格
                    text=text.replace(/\s/g, "");

                    //查找金额  /(\d{1,})\s*[元|包邮]|[币|￥]\s*(\d{1,})/
                }

                var post={
                    wbid:pid,
                    url:orig['t_url'],
                    text:text,
                    time:orig['created_at'],
                }

                // var Post = AV.Object.extend("Post");
                // var post = new Post();
                // post.wbid=pid;
                // post.url=orig['t_url'];
                // post.text=text;
                // post.time=orig['created_at'];

                //用户信息
                var ouser=orig['user'];
                post['user']={
                        id:ouser['idstr'],
                        name:ouser['name'],
                        //screen_name:ouser['screen_name'],
                        avatar:ouser['profile_image_url'],
                        verified:ouser['verified'],
                }

                // //获取图片
                // var pics=orig['pic_urls'];
                // if (pics.length>0) {
                //     var tmp=[];
                //     for (var i = 0; i < pics.length; i++) {
                //         tmp[i]=pics[i]['thumbnail_pic'];
                //     };
                //     post['pics']=tmp;
                // }else if(orig['thumbnail_pic']){
                //     pics=[orig['thumbnail_pic']];
                //     post['pics']=pics;
                // }

                //获取坐标
                if (orig['geo']) {
                    post.geo=orig['geo'];
                };

                
                origs.push(post);
            };
            
            callback(null,origs);
        });
    }).on('error', function(err) {
      callback(err);
    });

    
}


//================= API ================

//获取最新微博 
app.get('/api/refresh/weibo',function (req,res) {
    //1005051882458640
    //1005051761596064
    //1005052043408047
    //1841288857
    //3787475667
    //206198205

    var accs=['2043408047','1761596064','1882458640','1841288857','3787475667'];

    var sec=(new Date()).getSeconds();
    var index=sec%accs.length;

    var acc=accs[index];
    getPosts(acc,0,function(err,statuses){
        if (err) {
            console.error(err);
        } else {
            //res.json(statuses);
            //res.send(acc+' Get New Post: '+ statuses.length);
            res.json(statuses);
        }
    });
});



//使用express路由API服务/hello的http GET请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});


app.get('/test', function(req, res) {

    res.send();
});

app.get('/test/:user/:action', function(req, res) {
  res.send("User:"+req.params.user+"<br/>Action:"+req.params.action);
});


//最后，必须有这行代码来使express响应http请求
app.listen();
