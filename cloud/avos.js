var postQuery=new AV.Query('Post').descending('id');

exports.addPost=function (json,callback) {
    
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