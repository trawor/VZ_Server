require("cloud/app.js");

AV.Cloud.define("hello", function(req, res) {
  res.success("Hello world! 222");
});
