require.config({
    paths:{
        "jquery":'../lib/jquery-1.12.4.min'
    }
});
require(['jquery','msg'],function($,msg){
	console.log("main")
    
    setTimeout(()=>{
    	msg.msg(878878)
    },2000)
    //通过此方式引入jquery才能使用$，接下来正常写jquery代码就好
})