var app=require("cloud/app.js");
var api=require("cloud/api.js");
var model=require("cloud/model.js");

AV.Cloud.setInterval("refresh",1800, function() {
    console.info(model);
    api.refresh.all();
});

console.info('VZ restart!');
