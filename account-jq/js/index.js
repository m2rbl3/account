/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-05-08 21:56:14
 * @version $Id$
 */

$(function(){

	// 自适应宽度
	(function(){
		$("#list-item").height($(window).height()-50);
	})();

	// 获取localStorage数据
	(function(){
	    var oCheck=/^\d+$/;
	 	var oDataObj={};
	 	if(window.localStorage)
	 	for(key in localStorage){
	 		oDataObj=localStorage.getItem(key);
	 		if(oDataObj!==null){
	 			oDataObj=JSON.parse(localStorage.getItem(key));
	 		    if (oDataObj.time!==undefined){
	 	            oDataObj.time=oDataObj.time;     //提取时间戳中的年月日
	 	            $("#list-item").append(""
                        +"<ul data-key="+key+" class=\"event-item\">"
                        +"<li class=\"event-time\">"+oDataObj.time+"<\/li>"
                        +"<li class=\"event-description\">"
                        +"<img src=img/"+oDataObj.type+".png class=\"item-pic\">"
                        +"<span data-type="+oDataObj.type+" class=\"event\">"+oDataObj.event+"<\/span>"
                        +"<span class=\"money\">"+oDataObj.money+"<\/span>"
                        +"<input type=\"button\" class=\"item-delete\" value=\"删除\">"
                        +"<input type=\"button\" class=\"item-edit\" value=\"编辑\"><\/li><\/ul>"
                )
	 		    }
	 		}
		}
	 })();

    var oKey;  //编辑或删除的项目指向

    $(".item-delete").on("click",function(event){
    	console.log(event.target.dataset.key);
    	$(event.target).parents(".event-item").remove();
    	var deletedKey=$(this).parents(".event-item")[0].dataset.key
    	localStorage.removeItem(deletedKey);
    });

    $(".item-edit").on("click",function(){
    	$("#edit-page").css({display:'block','z-index':'2'});

    	// 编辑页面自动填充
    	var $parent=$(this).parents(".event-item");
    	$("#edit-time").val($parent.find(".event-time").text());
    	$("#edit-event").val($parent.find(".event").text());
    	$("#edit-money").val($parent.find(".money").text());
    	oKey=$(this).parents(".event-item").attr("data-key");
    });

    $("#edit-save").on("click",function(){
       // 改变index显示项目的值
       var $saveTarget=$("[data-key="+oKey+"]");
       $saveTarget.find(".event").text($("#edit-event").val());
       $saveTarget.find(".money").text($("#edit-money").val());
       $saveTarget.find(".event-time").text($("#edit-time").val());

       // 改变localStorage的值
       var oData =JSON.parse(localStorage.getItem(oKey));
       oData.event=$("#edit-event").val();
       oData.money=$("#edit-money").val();
       oData.time=$("#edit-time").val();
       JSON.stringify(oData);
       localStorage.setItem(oKey,JSON.stringify(oData));
       
       // 隐藏编辑页面
       $("#edit-page").css({display:'none','z-index':'-1'});
    });
});