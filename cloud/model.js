
exports={
    default_count:30,
    weibo:{
        appkey:'2858658895',
        appsec:"9d97c1cce2893cbdcdc970f05bc55fe4",
    },
    channel_account:{
        shuma:['2043408047','1761596064','1882458640','1841288857','3787475667'],
        //muying:['1769267263','2813948131','3057011237','3263012774'],
    },
    block_account:['3170023534'],
}

var textTool={
    trim:function (text) {
        //删除@的多个微博账号
        var delReg=/@[^ $]+|我在(这里)?:http:\/\/[a-zA-Z./0-9]+|((麻烦)|([多]?谢[谢]?)).+[\s|,|，|了]/g;
        text=text.replace(delReg,"");

        //删除连续空格
        text=text.replace(/\s\s|[,|，]$|求转[发]?|�/g, "");


        return text;
    },
    type:function (text) {
        var typeReg=/^求|^收|求购|急求|收个|试收/;
        if (typeReg.test(text)) {return 1};
        
        return 0;
    },

    price:function (text) {
        //查找金额

        var priceReg=/(\d{2,})[卖|出|元|块|¥|￥]|[币|¥|￥|价|钱|格|出|卖](\d{2,})|(\d{2,})[不]?包邮|(\d{2,})[不|可]刀/;

        var parr = priceReg.exec(text); 
        if (parr) {
            var x=parr.length;
            while(x--){
                var p=parr[x];
                if (p!=undefined) {
                    return p;
                };
            }
        }
        return null;
    }

}

exports.textTool=textTool;


//价格case
/*

出99新极品机子一台。两网无锁可越狱。黑色16g。3280出了！
成色党来~1150RMB 
买时2300。现在1550卖出（可小刀，
一起卖850，单机650就可以了
启示录日版 270优先广州面交不小刀 
转让价：1800。 谢谢。
tf卡 350走淘宝 
走淘宝，1300。
其余均完美2600要的私信我[爱你] 〜
暂定2500 走顺丰不包邮喔
450一台，走淘宝跳蚤街
磕碰～～～2000保价包顺丰
我出789买个
*/



//
//求购case
//收一台kingdle5

