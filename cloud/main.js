var app=require("cloud/app.js");

AV.Cloud.setInterval("refresh",300, function() {
	app.refresh(function (err,statuses) {
        if (err) {
            console.error(err);
        } else if(statuses){
            console.log("Get News:"+statuses.length);
        }else{
            console.log('nothing to do');
        }
    });
});
