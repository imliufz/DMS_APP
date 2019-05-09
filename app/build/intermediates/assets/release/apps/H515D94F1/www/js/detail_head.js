/**
 * 必定义参数：_menu_name 菜单名称
 * 可选定义参数:_back_url 后退到指定菜单(默认后退一页)
 * 可选定义参数:_back_func 点击后退调用指定方法(存在则优先调用该方法，默认调用back方法)
 * 可选定义参数:_is_loading 初始化加载中[1显示/2隐藏](默认隐藏)
 * 可选定义参数:_show_save 是否显示保存菜单([1显示/2隐藏]默认不显示)
 * 可选定义参数:_btn_type 是否显示保存菜单([1新增/2保存/3问号]默认保存)
 * 可选定义方法:_save_func 点击保存按钮时执行
 * 可选定义方法:_is_submit 是否为提交方法([1是/2否]默认否)
 */
var jsId = "detail_head_js";
var _menu_name = JSParm(jsId,"_menu_name");
var _back_url = JSParm(jsId,"_back_url");
var _back_func = JSParm(jsId,"_back_func");
var _is_loading = JSParm(jsId,"_is_loading");
var _show_save = JSParm(jsId,"_show_save");
var _btn_type = JSParm(jsId,"_btn_type");
var _save_func = JSParm(jsId,"_save_func");
var _is_submit = JSParm(jsId,"_is_submit");
var _show_tel = JSParm(jsId,"_show_tel");
var _right_btn_name = JSParm(jsId,"_right_btn_name");
var writeHtml = ''+
'<div class="topBar xf-res-topBar">'+
'	<div class="l" id="_dt_left_menu">'+
'		<a class="arrow" href="javascript:void(0)"></a>'+
'	</div>'+
'	<h1 id="_menu_name">'+_menu_name+'</h1>'+
'	<div class="r" id="_dt_right_menu" style="display:none;">'+
'		<a href="javascript:void(0)" id="_dt_right_btntype"></a>'+
'	</div>'+
'</div>';
document.write(writeHtml);

document.getElementById("_dt_left_menu").addEventListener("tap",function(){
	try{
		var isChange = false;
		try{isChange = changeFlag;}catch(e){}
		if(isChange == true) {
			MuiConfirm("页面尚未保存，返回会造成输入的数据丢失，确认返回吗?",function(e){
				if(e.index == 0){
					if(_back_func != undefined && _back_func != null && _back_func != ""){
						setTimeout(function(){
							if(_back_func.indexOf("(") >= 0){
								eval(_back_func);
							} else {
								eval(_back_func+"()");
							}
						},"1")
					} else if(_back_url != undefined && _back_url != null && _back_url != "") {
						setTimeout(function(){
							ToUrl(_back_url,2);
						},"1");
					} else {
						setTimeout(function(){
							mui.back();
						},"1");
					}
				}
			});
		} else {
			if(_back_func != undefined && _back_func != null && _back_func != ""){
				setTimeout(function(){
					if(_back_func.indexOf("(") >= 0){
						eval(_back_func);
					} else {
						eval(_back_func+"()");
					}
				},"1")
			} else if(_back_url != undefined && _back_url != null && _back_url != "") {
				ToUrl(_back_url,2);
			} else {
				mui.back();
			}
		}
	}catch(e){
		mui.back();
	}
});
try{
	if(_show_save == "1"){
		$("#_dt_right_menu").css("display","");
	}
	if(_show_tel == "1"){
		$("#_dt_right_menu").css("display","");
		$("#_dt_right_btntype").click(function(){
			callTel();
		});
	}
}catch(e){
	
}
try{
	if(_is_submit == "1"){
		if(_save_func != undefined && _save_func != null && _save_func != "") {
			$("#_dt_right_menu").html("<input type='submit' id='_dt_right_btntype' onclick='"+_save_func+"()' style='border:none;' value='' />");
		} else {
			$("#_dt_right_menu").html("<input type='submit' id='_dt_right_btntype' style='border:none;' value='' />");
		}
	}
	if(_btn_type == "1"){
		$("#_dt_right_btntype").css("background-image","url(images/add.png)");
	} else if(_btn_type == "3"){
		$("#_dt_right_btntype").css("background-image","url()");
		$("#_dt_right_btntype").html("<span style='font-size:16px'>帮助</span>");
	} else if(_btn_type == "4"){
		$("#_dt_right_btntype").css("background-image","url()");
		$("#_dt_right_btntype").html("<span style='font-size:16px'>"+_right_btn_name+"</span>");
	} else if(_btn_type == "5"){
		$("#_dt_right_btntype").css("background-image","url(images/plugmenu1.png)");
	}
}catch(e){
	
}
document.getElementById("_dt_right_menu").addEventListener("tap",function(){
	try{
		if(_is_submit != "1"){
			if(_save_func != undefined && _save_func != null && _save_func != "") {
				if(_save_func.indexOf("(") >= 0){
					eval(_save_func);
				} else {
					eval(_save_func+"()");
				}
			}
		}
	}catch(e){
		
	}
});

var initLoading = null;
document.addEventListener('plusready',function () {
    // 在这里调用plus api
    if(_is_loading == "1"){
		initLoading = MuiLoading();
		try{
	    	setTimeout(function(){
	    		if(initLoading != null){
					try{initLoading.close();initLoading=null;}catch(e){}
				}
	    	},"2000");
	    }catch(e){
	    }
    }
    try{
    	var wv=plus.webview.currentWebview();
		//关闭侧滑返回功能
		wv.setStyle({'popGesture':'none'});
    }catch(e){
    }
},false);

/**
 * 重写 mui.back
 */
/*var muiBack = mui.back;
mui.back = function(event) {
	if(!IsNull(_back_url)){
		ToUrl(_back_url,2);
	} else {
	    muiBack();
	}
    return false;
};*/

/*mui.init({
	keyEventBind: {
		backbutton: false  //关闭back按键监听
	}
});*/