var app=require("cloud/app.js");
var api=require("cloud/api.js");

AV.Cloud.setInterval("refresh",1800, function() {
    console.info('refresh all');
	api.refresh.all();
});
