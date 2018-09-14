
$(function(){
	// 高度自适应
	(function(){
		$("#container").height($(window).height()-50);
	})();

	function getPayAndIncome(type){
		//获取支出数据
		var countFood=0,countLife=0,countEntertainment=0,countOther=0,countIncome=0;
		var oItem={},payment=[];

		//获取收入数据	
 		var dateArr=[];

 		//取localStorag值
		for(key in localStorage){
			oItem=JSON.parse(localStorage.getItem(key));

			if(oItem!==null){
				//取支出
				if(oItem.type!=undefined)
				switch(oItem.type){
			        case "food":
			            countFood+=Number(oItem.money);break;
			        case "life":
                        countLife+=Number(oItem.money);break;
                    case "entertainment":
                    	countEntertainment+=Number(oItem.money);break;
                    case "other":
                	    countOther+=Number(oItem.money);break;
                }

                // 取收入
                if(oItem.time!=undefined && oItem.type=="income"){
                	var year=oItem.year,month=oItem.month,money=oItem.money;

                    if(dateArr[year]==undefined){
                        dateArr[year]=[];
                    	    // console.log(typeof dateArr[year][oItem.month])
                    } 

                    if(dateArr[year][month]==undefined){
                        dateArr[year][month]=[];
                    	dateArr[year][month]["money"]=0;
                    }
                    dateArr[year][month]["money"]+=Number(oItem.money);
                }
            }
	    }
	    payment=[countFood,countLife,countEntertainment,countOther];
	    payment.all=countFood+countLife+countEntertainment+countOther;
	    return type=="pay"? payment :dateArr
	}

	function getPercent(){
		var payment=getPayAndIncome("pay");
		var percent=[];
		var allCount=payment.all;
		for(var i=0,len=payment.length;i<len;i++)
			percent[i]=payment[i]/allCount;
		return allCount>0?percent:"quit";
	}

	function drawCircle(){
		var percent=getPercent();
	        var circle=document.getElementById("circle");
	        var color=["#F44C53","#EC48BD","#464AEB","#1B9382"];
	        $list=$("#event-type-list .event-type");

	        if(circle.getContext){
	       	    circle=circle.getContext("2d");
	          	circle.translate(100,100);
	            if(percent!="quit"){
	                var start=0,end=0,oNum;
	    	        for(var i=0,len=percent.length;i<len;i++){
	       	    	    oNum=percent[i]*100;
	       	    	    $list[i].innerHTML+=oNum.toFixed(2)+"%";
	                    circle.beginPath();
	                    circle.moveTo(0,0);
	                    end+=percent[i]*2*Math.PI;
	                    circle.arc(0,0,98,start,end,false);
	                    circle.fillStyle=color[i];
	                    circle.fill();
	                    circle.closePath();
	                    start=end;
                       }
                }
                    else{
            	        circle.textAlign="center";
            	        circle.textBaseline="middle";
            	        circle.font="20px Arial";
            	        circle.fillText("无支出记录",0,0);
            }
   		}
    }

    function drawLineChat(){
    	var dateArr=getPayAndIncome();
    	var oDate=new Date();
    	var thisYear=oDate.getFullYear();
    	var thisMonth=oDate.getMonth()+1; 

    	//取画布
    	lineChat=document.getElementById("line-chat");
    	if(lineChat.getContext)
    	lineChat=lineChat.getContext("2d");
        lineChat.translate(70,200);

        //画坐标轴//
        lineChat.beginPath;
        lineChat.moveTo(0,0);
        lineChat.lineTo(0,-200);
        lineChat.moveTo(0,0);
        lineChat.lineTo(200,0);
        lineChat.strokeStyle="#000";
        lineChat.stroke();
        lineChat.closePath;

        //画虚线
        lineChat.beginPath;
        for(var i=0,j=40;i<4;i++,j+=40){
        	lineChat.moveTo(j,0);
        	for(var k=0;k<200;k+=10){
        	   lineChat.moveTo(j,-k)
               lineChat.lineTo(j,-k-5);
               lineChat.stroke();
        	}
        }
        lineChat.closePath;

        //画X轴数据
        lineChat.textAlign="center";
        lineChat.textBaseline="middle";
        // lineChat.font="20px Arial";
        for(var i=0,j=0;i<5;i++,j+=40){
            lineChat.fillText((thisMonth-2+i)+"月",j,10);
            if(dateArr[thisYear]!=undefined && dateArr[thisYear][String(thisMonth-2+i)]!=undefined)
                $("#income-list").append("<li>"+(thisMonth-2+i)+"月:"+dateArr[thisYear][String(thisMonth-2+i)]["money"]+"元</li>");
        	else 
        		 $("#income-list").append("<li>"+(thisMonth-2+i)+"月:0元</li>");
        	
        }

        //处理Y轴数据
        var compArr=new Array();
        for(var i=0;i<5;i++){
        	if(dateArr[thisYear]!=undefined && dateArr[thisYear][String(thisMonth-2+i)]!=undefined)
                compArr.push(dateArr[thisYear][String(thisMonth-2+i)]["money"]);
        }
        if(compArr.length>0){
           var maxIncome=Math.max.apply(null,compArr);
           var digit=Math.pow(10,String(maxIncome).split("").length-1)
           var maxNumber=digit*Math.ceil(maxIncome/digit);
           var section=maxNumber/180;
        }
        else maxNumber=0;

        //画Y轴数据
        lineChat.textAlign="end";
        for(var i=0,j=0;i<6;i++,j+=36){
        	lineChat.fillText(maxNumber*(i)/5,-5,-j);
        }
        lineChat.textAlign="center";
        lineChat.fillText("(元)",-10,-193);

         //画折线
        lineChat.beginPath;
        for(var i=0,j=0;i<5;i++,j+=40){
        	if(dateArr[thisYear]!=undefined && dateArr[thisYear][String(thisMonth-2+i)]!=undefined)
        	    lineChat.moveTo(j,-dateArr[thisYear][String(thisMonth-2+i)]["money"]/section);
        	else lineChat.moveTo(j,-0);

        	if(dateArr[thisYear]!=undefined && dateArr[thisYear][String(thisMonth-1+i)]!=undefined)
        	    lineChat.lineTo(j+40,-dateArr[thisYear][String(thisMonth-1+i)]["money"]/section);  
        	else lineChat.moveTo(j+40,0);  	
        	
        }
        lineChat.fill();
        lineChat.stroke();
        lineChat.closePath;
    }

    drawCircle();
    drawLineChat();
});