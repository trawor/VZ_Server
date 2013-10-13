require("cloud/app.js");

AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

console.log('main run')