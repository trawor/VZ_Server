var app=require("cloud/app.js");
var api=require("cloud/api.js");

AV.Cloud.setInterval("refresh",1800, function() {
    api.refresh.all();
});

console.info('VZ restart!');