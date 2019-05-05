/**
 * 可选定义参数:_show_search 是否显示搜索[1显示/2不显示]默认显示
 * 可选定义参数:_is_loading 初始化加载中[1显示/2隐藏](默认隐藏)
 * 可选定义参数:_show_add 是否显示新增按钮[1显示/2隐藏](默认显示)
 */

var jsId = "index_head_js";
var _show_search = JSParm(jsId,"_show_search");
var _is_loading = JSParm(jsId,"_is_loading");
var _show_add = JSParm(jsId,"_show_add");
var _show_left_menu = JSParm(jsId,"_show_left_menu");

var writeHtml = ''+
'<div class="nav xf-res-header">'+
'        	<div class="left" id="leftMenu">'+
'            	<font menu></font>'+
'            </div>'+
'        	<div class="center">'+
'            	<h4><span id="dealerName"></span></h4>'+
'            </div>'+
'        	<div class="right" id="addZt">'+
'            	<font add></font>'+
'            </div>'+
'        </div>'+
'    	'+
//'        <div class="wlc">'+
//'        	<div>'+
//'            	<img src="images/xl.png"><font>欢迎您：</font><font><span id="logonName"></span></font>'+
//'            </div>'+
//'        	<div>'+
//'            	<a href="tel:023-67543333" target="_self">'+
//'            		<img src="images/tel.png" />'+
//'                </a>&nbsp;&nbsp;'+
//'            	<a href="javascript:void(0);" id="_tc">'+
//'            		<img src="images/wtsb.png" style="width:22px;height:20px;"/>&nbsp;<img src="images/tc.png" style="width:30px;height:14px;"/>'+
//'                </a>'+
//'            </div>'+
//'        </div>'+
//'    '+
'    	<div class="wlc input xf-res-input" style="height:40px;position:relative;z-index:1;background-color:#1790E4;margin-top:-1px;" id="_search">'+
'        	<form onsubmit="searchFunc();return false;"><input style="width: 80%;height:30px;margin-top:5px;" id="search_txt" type="text" value="" class="text" placeholder="请输入客户姓名/电话/级别">'+
'           <img src="images/seach.png" id="seach" style="width:27px;height:25px;"/></form>'+
'        </div>';
document.write(writeHtml);

$(document).ready(function() {
	try{
		document.getElementById("addZt").addEventListener("tap",function(){
			//ToUrl("hallReceptionAdd.html?toPage=index");
			ToUrl("hallReceptionEdit.html?toPage=index");
		});
	}catch(e){
		//TODO 不存在新增按钮
	}
//	document.getElementById("_tc").addEventListener("tap",function(){
//		ToUrl("problemReportAdd.html?toPage=index");
//	});
	document.getElementById("seach").addEventListener("tap",function(){
		var search_txt = document.getElementById("search_txt").value;
		if(search_txt == ""){
			MuiMessage("请输入用户名/电话/级别");
			return;
		}
		ToUrl("xs_list.html?search="+search_txt);
	});
});

function searchFunc(){
	var search_txt = document.getElementById("search_txt").value;
	if(search_txt == ""){
		MuiMessage("请输入用户名/电话");
		return;
	}
	ToUrl("xs_list.html?search="+search_txt);
}

try{
	if(_show_search == "0"){
		$("#_search").css("display","none");
	}
	if(_show_add == "0"){
		$("#addZt").html("&nbsp;");
	}
	var LOGIN_MENU = getLocalStorage("LOGIN_MENU");
	var json = eval("("+LOGIN_MENU+")");
	var tsRole = 0;
	for (var i=0;i<json.menuList.length;i++){
		if(json.menuList[i].MENUTYPE=="105530"){
			tsRole = 1;
		}
	}
	if(IsNull(_show_left_menu) || tsRole == 0) {
		$("#leftMenu").html("&nbsp;");
	}else{
		if(_show_left_menu == "1"){//线索跳转到投诉
			$("#leftMenu").click(function(){
				ToUrl("complaint.html");
			});
		}else{//投诉跳转到线索
			$("#leftMenu").click(function(){
				ToUrl("index.html");
			});
		}
	}
}catch(e){
	
}

var initLoading = null;
document.addEventListener('plusready',function () {
    // 在这里调用plus api
    if(_is_loading == "1"){
		initLoading = MuiLoading();    	
    }
    try{
    	var wv=plus.webview.currentWebview();
		//关闭侧滑返回功能
		wv.setStyle({'popGesture':'none'});
    }catch(e){
    }
},false);

mui.init({
	keyEventBind: {
		backbutton: false  //关闭back按键监听
	}
	/*preloadPages: [{
		id: 'index.html',
		url: 'index.html'
	},{
		id: 'remind.html',
		url: 'remind.html'
	},{
		id: 'report_list.html',
		url: 'report_list.html'
	},{
		id: 'mine.html',
		url: 'mine.html'
	}]*/
});

mui.os.plus && !mui.os.stream && mui.plusReady(rTm);

function rTm(){
	setTimeout(releaseMemory,"500");
	//获取通话记录
	_getCallLog();
}

function releaseMemory(){
	try{
		var webs = plus.webview.all();
		if(webs != null && webs.length > 0){
			for (var i = 0;i < webs.length;i++) {
				var webUrl = webs[i].getURL()+"";
				webUrl = webUrl.substring(webUrl.lastIndexOf("/")+1,webUrl.length);
				if(webUrl == "login.html" || webUrl == "index.html" || webUrl == "complaint.html" || webUrl == "report_list.html" || webUrl == "mine.html" || webUrl == "remind.html"){
				} else {
					webs[i].close("none",0);
				}
			}
		}
	}catch(e){
	}
}