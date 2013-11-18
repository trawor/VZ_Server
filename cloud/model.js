

exports.textTool={
    trim:function (text) {
        //删除@的多个微博账号
        var delReg=/@[^ $]+|我在(这里)?:http:\/\/[a-zA-Z./0-9]+|((麻烦)|([多]?谢[谢]?)).+[\s|,|，|了]/g;
        text=text.replace(delReg,"");

        //删除连续空格
        text=text.replace(/\s\s|[,|，]$|求转[发]?|�/g, "");


        return text;
    },
    type:function (text) {
        var typeReg=/^求|^收|求购|急求|收个|持币|试收|[收|求]一/;
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

exports.channel_account={
    shuma:['2043408047','1761596064','1882458640','1841288857','3787475667','3701452524'],
    //muying:['1769267263','2813948131','3057011237','3263012774'],
}

exports.default_count=30;

exports.weibo={
        appkey:'2858658895',
        appsec:"9d97c1cce2893cbdcdc970f05bc55fe4",
}
    
exports.block_account=['3170023534'];




