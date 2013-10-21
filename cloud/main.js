var app=require("cloud/app.js");
var api=require("cloud/api.js");


AV.Cloud.setInterval("weiboRefresh",1800, function() {
	console.info('refresh ----------------');
    api.refresh.all();
});


    