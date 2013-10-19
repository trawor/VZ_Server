var api=require("cloud/api.js");

// 在Cloud code里初始化express框架
var express = require('express');
var app = express();

// App全局配置
app.set('views','cloud/views');   //设置模板目录
app.set('view engine', 'ejs');    // 设置template引擎
app.use(express.bodyParser());    // 读取请求body的中间件

app.map = function(a, route){
  route = route || '';
  for (var key in a) {
    switch (typeof a[key]) {
      // { '/path': { ... }}
      case 'object':
        app.map(a[key], route + key);
        break;
      // get: function(){ ... }
      case 'function':
        app[key](route, a[key]);
        break;
    }
  }
};

app.map({
  '/api': {
    //记录
    '/post':{
        '/before/:id': {
            get: api.post.before,
        },
        '/after/:id': {
            get: api.post.after,
        },
        '/comment/:id':{
            post: api.post.comment,
        },
        '/id/:id':{
            get:api.post.get,
        },
    },
    
    //刷新
    '/refresh': {
        get: api.refresh.all,

        '/:channel': {
            get: api.refresh.channel,
        },
    },
    
  },
});


app.listen();

console.log(app.routes);
