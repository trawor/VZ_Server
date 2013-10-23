var model   = require('cloud/model.js');
var weibo   = require('cloud/weibo.js');
var avos    = require("cloud/avos.js");

var Post = AV.Object.extend("Post");
var postQuery=new AV.Query('Post');


function query (req,res,opt) {
    var q;
    if (opt<0) {
        q=postQuery.lessThan('objectId',req.params.id);
    }else if (opt>0){
        q=postQuery.greaterThan('objectId',req.params.id);
    }else{
        q=postQuery;
    }

    if (req.query.channel) {
        q=q.equalTo('channel',req.query.channel);
    }

    if (req.query.type) {
        q=q.equalTo('type',req.query.type);
    }
    
    if (req.query.photo=='1') {
        q=q.exists('pics');
    };

    if (req.query.verified=='1') {
        q=q.equalTo('user.verified',true);
    };

    if (req.query.count) {
        q=q.limit(req.query.count);
    }else{
        q=q.limit(model.default_count);
    }



    //q=q.descending('time');
    q.find({
      success: function(object) {
        res.json(object);
      },

      error: function(object, error) {
        res.json(error);
      }
    });
}

exports.post={
    before:function (req,res) {
        query(req,res,-1);
    },

    after:function (req,res) {
        query(req,res,1);
    },

    list:function (req,res) {
        query(req,res,0);
    },

    get:function (req,res) {
        postQuery.get(req.params.id, {
          success: function(object) {
            var p=object.toJSON();
            //p['time']=p['time']['iso'];
            res.json(p);
          },

          error: function(object, error) {
            res.json(error);
          }
        });
    },
    comment:function (req,res) {
        res.send('post comment to id:'+req.params.id);
    },
    add:function (req,res) {
        res.send('add post');
    },
}


//通过频道刷新微博数据
function refresh (req,res,channel_name) {
    var accs=model.channel_account[channel_name];

    console.info('refresh: '+ channel_name);
    
    if (accs) {
        var index=Math.ceil(Math.random()*100)%accs.length;
        var acc=accs[index];

        console.info('refresh: '+channel_name+" account:"+acc);

        avos.lastWeiboID(acc,function (wb) {
            var lid=0;
            if (wb) {
                lid=wb.get('last_wbid');
            };

            weibo.fetchPosts(acc,lid,function (posts,dels,last_wbid) {
                if(res)res.json(posts);

                
                for (var i = 0; i < posts.length; i++) {
                    var post=posts[i];

                    if(model.block_account.indexOf(post.user.id)>-1){
                        console.info('ignore user: '+ post.user.id);
                        continue;
                    }                

                   
                    if (accs.indexOf(post.user.id)>-1) {
                        // 自己转自己的... 一般都是广告
                        console.info('ignore: '+post.text);
                        continue;
                    };

                    var postObj = new Post();
                    
                    post['channel']=channel_name;
                    postObj.save(post,{
                        success: function(p) {
                            console.log('success: '+p.id);
                        },
                        error: function(p, error) {
                          if (error.code!=137) {
                            console.error(error);
                          }
                        }
                    });
                };

                //TODO: 从数据库中标记为已交易 (Travis 13-10-13 16:44)
                for (var i = 0; i < dels.length; i++) {
                    var q=new AV.Query('Post').equalTo('wbid',dels[i]);
                    q.first({
                        success: function(p) {
                            
                            if (p!=undefined && p.get('type')!=2) {
                                console.log(p._serverData.text);
                                console.log('should del:'+p.get('last_wbid')+" type:"+p.get('type'));
                                //console.log(p.toJSON());
                                // p.set('type',2,{
                                //     success:function  (argument) {
                                //         console.log('update del:'+argument);
                                //     },
                                //     error: function(p, error) {
                                //       console.log('update error:'+error);
                                //     }
                                // });
                                p.save({type:2},{
                                    success:function  (argument) {
                                        console.log('update del:'+argument);
                                    },
                                    error: function(p, error) {
                                      console.log('update error:'+error);
                                    }
                                });
                            };
                            
                        },
                        error: function(p, error) {
                          console.error(error);
                        }
                    });
                }

                //save last req id
                if (last_wbid) {
                    function newFresh () {
                        console.info('channel:'+channel_name+' > account:'+acc+' last_wbid:'+last_wbid);
                        
                        var RefreshCLS = AV.Object.extend("Refresh");

                        var ref = new RefreshCLS();
                        ref.save(
                            {
                                'account':acc,
                                'last_wbid':last_wbid,
                            },
                            
                            {
                                success: function(p) {
                                    console.info('`Refresh` add wbid:'+p.get('last_wbid'));
                                },
                                error: function(p, error) {
                                    console.error(error);
                                }
                            });
                    }
                    
                    avos.lastWeiboID(acc,function (p) {
                        if (p) {
                            p.save({'last_wbid':last_wbid},{
                                        success:function  (argument) {
                                            console.info('`Refresh` acc:'+acc+' update wbid:'+p.get('last_wbid')+' to:'+last_wbid );
                                        },
                                        error: function(p, error) {
                                           console.error('`Refresh` update error:'+error);
                                        }
                            });
                        }else{
                            newFresh();
                        }
                    });
                };
            });
        })

        
        
    }else{
        res.send('no channel: '+channel_name);
    }
}

exports.refresh={
    channel:function (req,res) {
        var channel_name=req.params.channel;
        refresh(req,res,channel_name);
    },
    all:function (req,res) {
        console.info('refresh all:');
        if (model.channel_account) {
            console.info(model.channel_account);

            for (var k in model.channel_account) {
                refresh(req,res,k);
            }
        }else{
            console.error('can NOT get `model`!!!');
            res.json(model);
        }
        
    }
}
