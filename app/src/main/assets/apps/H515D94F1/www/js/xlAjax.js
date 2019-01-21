/**
 * author liufazhong
 * ajax
 */
//var httpUrlHead = "http://192.168.43.82:8085/app/dcsApp/";//本地
//var httpUrlHead = "http://222.177.26.242:9080/yxbapp/dcsApp/";//测试环境
var httpUrlHead = "http://cvsses.changan.com.cn/jcx-app-two/dcsApp/";//正式环境
var httpUrlEnd = "rpcFlag=2";

var _data_type = _myBrowser();
if(_data_type == "0"){
	alert("不支持的浏览器!请使用IE9以上或google浏览器!");
}

function checkError(inputVal){
	//安全测评专用
	/*var errorMap = ["select", "and", "or", "update", "delete", "insert", "script", "sleep", "iframe", 
"union", "all", "null", "char", "from", "where", "sleep", "chr","(", ")", "<", ">", ";", "=", "'", "\"", "*", "/", "#", "+", "|" ];*/

var errorMap = ["script", "iframe", "<", ">"];
	for (var i=0;i<errorMap.length;i++) {
		if(inputVal.indexOf(errorMap[i]) !=-1){
			return errorMap[i];
		}
	}
	return 'true';
}
function makeFormCall(toUrl,showFunc,formName,isLoading,isInitLoading){
	var errorFlag = false;
	
	$("input[type='text'],textarea").each(function(){
		var inputVal = $(this).val();
		if(!IsNull(inputVal)){
			var checkStr = checkError(inputVal);
			if(checkStr != "true"){
				MuiAlert("含有非法字符:"+checkStr);
				errorFlag = true;
				return;
			}
		}
	});
	if(errorFlag){
		return;
	}
	var wobj = null;
	try{if(isLoading){wobj = MuiLoading();}}catch(e){}
	formName = "fm";//表单名固定为fm
	if(setFormCount == 0){
		setForm(formName);
	}
	try{formName = appendForm(formName);}catch(e){}
    var formParam = $("#"+formName+"").serialize();//序列化表格内容为字符串    
    $.ajax({    
        type:'post',        
        url:toUrl,    
        data:formParam,    
        cache:false,
        dataType:"json",    
        success:function(data){
        	try {
    			var json = data;
        		if (json != null && json.Exception != undefined && json.Exception != null) {
					MuiAlert(json.Exception.message,function(){
						//出现异常时调用方法
						try {exceptionFunc();} catch (e) {}
					});
				} else {
					if(json.RESULT == undefined) {} else {
						if (json.RESULT.funcStatus == 1) {
		            		//成功时调用
		            		try {showFunc(json);} catch (e) {console.log(e);}
		    			} else {
		    				MuiAlert(json.RESULT.funcMessage,function(){
		    					if (json.RESULT.toLogin == "10041001") {
			    					//跳转到首页
			    					var curHref = window.location.href.substring(window.location.href.lastIndexOf("/")+1,window.location.href.length);
			    					if(curHref != "login.html"){
			    						ToUrl("login.html",2);
			    					}
			    				}
		    				});
		    			}
					}
				}
			} catch (e) {
				console.log(e);
				MuiMessage("连接失败,请检查网络!");
			} finally {
				if(isLoading && wobj != null){
        			try{wobj.close();wobj=null;}catch(e){}
        		}
				if(isInitLoading && initLoading != null){
					try{initLoading.close();initLoading=null;}catch(e){}
				}
			}
        },
        error:function(data){
        	try {
        		var json = data;
        		if (json != null && json.Exception != undefined && json.Exception != null) {
					MuiAlert(json.Exception.message,function(){
						//出现异常时调用方法
						try {exceptionFunc();} catch (e) {}
					});
				} else {
					if(json.RESULT == undefined) {
						if(json.responseText == undefined || json.responseText == "") {
							MuiAlert("连接失败,请检查网络!");
							//MuiMessage("连接失败,请检查网络!");
						} else {
							json = eval("("+json.responseText+")");
							if (json.RESULT.funcStatus == 1) {
			            		//成功时调用
			            		try {showFunc(json);} catch (e) {console.log(e);}
			    			} else {
			    				MuiAlert(json.RESULT.funcMessage,function(){
			    					if (json.RESULT.toLogin == "10041001") {
				    					//跳转到首页
				    					var curHref = window.location.href.substring(window.location.href.lastIndexOf("/")+1,window.location.href.length);
				    					if(curHref != "login.html"){
				    						ToUrl("login.html",2);
				    					}
				    				}
			    				});
			    			}
						}
					} else {
						if (json.RESULT.funcStatus == 1) {
		            		//成功时调用
		            		try {showFunc(json);} catch (e) {console.log(e);}
		    			} else {
		    				MuiAlert(json.RESULT.funcMessage,function(){
		    					if (json.RESULT.toLogin == "10041001") {
			    					//跳转到首页
			    					var curHref = window.location.href.substring(window.location.href.lastIndexOf("/")+1,window.location.href.length);
			    					if(curHref != "login.html"){
			    						ToUrl("login.html",2);
			    					}
			    				}
		    				});
		    			}
					}
				}
			} catch (e) {
				console.log(e);
				MuiMessage("连接失败,请检查网络!");
			} finally {
				if(isLoading && wobj != null){
        			try{wobj.close();wobj=null;}catch(e){}
        		}
				if(isInitLoading && initLoading != null){
					try{initLoading.close();initLoading=null;}catch(e){}
				}
			}
        }
    });    
}


function _myBrowser() {
	//0 不支持的浏览器
	//1 jsonp
	//2 json
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
	var isIE = userAgent.indexOf("compatible") > -1
			&& userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
	//var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
	//var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
	//var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1 ;//判断是否为谷歌浏览器
	if (isIE) {
		var IE5 = IE55 = IE6 = IE7 = IE8 = false;
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		IE55 = fIEVersion == 5.5;
		IE6 = fIEVersion == 6.0;
		IE7 = fIEVersion == 7.0;
		IE8 = fIEVersion == 8.0;
		IE9 = fIEVersion == 9.0;
		IE10 = fIEVersion == 10.0;
		IE11 = fIEVersion == 11.0;
		if (IE55 || IE6 || IE7 || IE8) {
			return "0";
		} else if (IE9) {
			return "1";
		} else {
			return "2";
		}
	} else {
		return "2";
	}
}

function appendForm(formName){
	if(IsNull(formName)){
		formName = "loginSession";
	}
	return formName;
}

var setFormCount = 0;
function setForm(formName){
	var logonUser = null;
	try{logonUser = $("#logonUser").val();}catch(e){logonUser = null;}
	if(IsNull(logonUser)){
		if(IsNull(formName)){
			try{$("#loginSession").remove();}catch(e){}
			var appHtml = ""+
			"<form id='loginSession' name='loginSession' method='post'>"+
				"<input type='hidden' id='logonUser' name='logonUser' value=''/>"+
			"</form>";
			$(document.body).append(appHtml);
		} else {
			var hasFormName = null;
			try{hasFormName = $("#"+formName).attr("id");}catch(e){}
			if(IsNull(hasFormName)){
				try{$("#"+formName).remove();}catch(e){}
				var appHtml = ""+
				"<form id='"+formName+"' name='"+formName+"' method='post'>"+
					"<input type='hidden' id='logonUser' name='logonUser' value=''/>"+
				"</form>";
				$(document.body).append(appHtml);
			} else {
				try{$("#logonUser").remove();}catch(e){}
				var appHtml = "<input type='hidden' id='logonUser' name='logonUser' value=''/>";
				$("#"+formName).append(appHtml);
			}
		}
		var logonValues  = getLocalStorage('logonUser');
		$("#logonUser").val(logonValues);
	}
	setFormCount = 1;
}
