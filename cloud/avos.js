var postQuery=new AV.Query('Post').descending('id');

exports.addPost=function (json,callback) {
    
}

exports.lastWeiboID=function(acc,callback){
    var q=new AV.Query('Refresh').equalTo('account',acc);
    q.first({
        success: function(p) {
            console.log('get lastWeiboID:'+p.get('last_wbid'));
                if (p!=undefined) {
                    callback(p);
                }else{
                    callback();
                }
                
            },
        error: function(p, error) {
                console.error(error);
                callback();
            }
    });
}


exports.httpGet=function(url,callback){
    console.log('HTTP GET: '+url);
    var options = {
        url:url,
        method: 'GET',
        success: function(httpResponse) {
            callback(httpResponse);
        },
        error: function(httpResponse) {
            callback(httpResponse);
        }
    };
    AV.Cloud.httpRequest(options);
}