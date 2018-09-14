
$(function(){

	// 选择账目类型预览
	var $return=$("#header-return"),
	    $eventType=$("#event-type"),
	    $eventImg=$("#event-type li img"),
	    $previewImg=$("#preview-img"),
	    $previewMsg=$("#preview-msg"),
	    $previewEvent=$("#preview-event"),
	    $previewMoney=$("#preview-money"),
	    $previewDelete=$("#preview-delete"),
	    $event=$("#event"),
	    $money=$("#money"),
	    $btnSave=$("#btn-save"),
	    selectedEvent;  //选中事项

	function displayMoney(){  //预览金额
		if($money.val()!=""){
			if(selectedEvent!="income"){
		        $previewMoney.text("金额：-"+$money.val());
		        $previewMoney.removeClass('income');
		        if(selectedEvent==undefined){
		    	    $previewMoney.text("金额："+$money.val());
		            $previewMoney.removeClass('income');
		        }   
		    }
	        else{
	            $previewMoney.text("金额：+"+$money.val());
	            $previewMoney.addClass('income');
	        }
	    }
	    else $previewMoney.text("金额：")
	}

	function check(){    //检测输入是否正确
		var check=/^(\d+)(\.\d+)?$/; //检测数字
		if( check.test($money.val()) && $money.val()!="" ){
		    if($event.val()!=""){
		    	if(selectedEvent!==undefined){
		    		var oTime=new Date();
		    		oTime.time=oTime.toLocaleString().substr(0,10).trim();
		    		oTime.month=oTime.getMonth()+1;
		    		oTime.year=oTime.getFullYear();
		    		var oData = JSON.stringify({
		    			"money":$money.val(),
		    			"event":$event.val(),
		    			"time":oTime.time,
		    			"month":oTime.month,
		    			"year":oTime.year,
		    			"type":selectedEvent});		
		  	    	setLocalStorage(oData);
		  	    }
		  	    else alert("请选择事件类型");
		  	}  
		    else alert("请输入事项");
		}
	    else alert("金额请输入数字");
	    $money.val("");
	    $previewMoney.text("金额：");

	}

	function setLocalStorage(data){
		if(window.localStorage){
		    var oCount=localStorage.getItem("count");
		    if(localStorage.getItem(oCount)===undefined){
		        localStorage.setItem(0,data);
		        localStorage.setItem("count",0);
		    }
		    else{
		        localStorage.setItem(Number(oCount)+1,data);
		        localStorage.setItem("count",Number(oCount)+1);
		        }
		}
		window.location.href="index.html";
	}

	//返回主页
	$return.on("click",function(){
		 if(window.history.go)
		 	window.history.go(-1);
		 else if(document.referrer){
			if(document.referrer==="")
				window.location="index.html";
		    else window.location=document.referrer;
		 }
	});

	//选择账目类型设置预览图标
	$eventType.on("click","li",function(){
		var $selectedImg=$(this).children('img');
		if($selectedImg.hasClass('selected')){
			$selectedImg.removeClass('selected');
			$previewImg.children("img").remove();
			selectedEvent=undefined;
		}
		else{
			$eventImg.removeClass('selected');
			$previewImg.children("img").remove();
			$selectedImg.addClass("selected");
		    $previewImg.append('<img src='+$selectedImg.attr("src")+'>');
		    selectedEvent=$selectedImg[0].dataset.type;
		}
		    displayMoney();
		    
	});

	//点击删除图标
	$previewDelete.on('click', function() {
           $event.val("");
           $money.val("");
           $eventImg.removeClass('selected');
           $previewEvent.text("事项：");
           $previewMoney.text("金额：");
           $previewImg.children("img").remove();
           selectedEvent=undefined;
	});

	//预览 事项和金额
	$event.on("input",function(){
		$previewEvent.text("事项："+$event.val());
	});

	$money.on("input",displayMoney);


	//保存和检测金额输入
	$btnSave.on("click",function(){
		check();
    })

});
	