define(function(){
	
	var msg = function(str){
		console.log("msg");
		setTimeout(()=>{
			$("#box").html(str)
		},2000)
	}
	
	return {
		msg:msg
	}
})