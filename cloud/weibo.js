var avos=require("cloud/avos.js");
var model=require("cloud/model.js");

exports.fetchPosts=function (userid,from,callback) {
    from='0'; //强制重新刷
    
    var count=20;
    var path="/2/statuses/user_timeline.json?source=4229079448&uid="+userid+"&since_id="+from+"&count="+count;
    var url="http://api.weibo.com"+path;
    
    avos.httpGet(url,function (res) {
        var json=res.data;
        
        var statuses=json['statuses'];
        
        var lastid='0';

        var dels=[];
        var origs=[];
        for (var i = 0; i < statuses.length; i++) {
            var item=statuses[i];
            var itemid=item['idstr'];
            if (itemid>lastid) {lastid=itemid};


            var orig=item['retweeted_status'];

            //只显示转发的内容
            if (!orig) {continue;};

            var pid=orig['idstr'];
            var text=orig['text'];
            //console.log('"'+text+'",');
            
            //0:出售 1:求购 2:删除
            var type=0; 

            if (text.indexOf('此微博已被作者删除')>0) {
                dels.push(pid);
                continue;
            }
                
            //用户信息
            var ouser=orig['user'];
            if (!ouser) {continue};
            
            text=model.textTool.trim(text);

            type=model.textTool.type(text);

            var post={
                wbid:pid,
                type:type,
                text:text,
                time:new Date(orig['created_at']),
            }
            
            post['user']={
                id:ouser['idstr'],
                name:ouser['name'],
                //screen_name:ouser['screen_name'],
                avatar:ouser['profile_image_url'],
                verified:ouser['verified'],
            }

            //查找金额
            var price=model.textTool.price(text);
            if (price) {
                post.price=price;
            };

            
            //获取图片
            var pics=orig['pic_urls'];
            
            if (pics && pics.length>0) {
                var tmp=[];
                for (var j = 0; j < pics.length; j++) {
                    tmp.push(pics[j]['thumbnail_pic']);
                };
                post.pics=tmp;
            }

            //获取坐标
            if (orig['geo']) {
                post.geo=orig['geo'];
            };
            origs.push(post);

        };
        
        callback(origs,dels,lastid);
    });
}