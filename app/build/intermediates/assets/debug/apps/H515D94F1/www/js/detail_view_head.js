/**
 * 必定义参数：_menu_name 菜单名称
 * 可选定义参数:_show_save 是否显示保存菜单([1显示/2隐藏]默认不显示)
 * 可选定义方法:_save_func 点击保存按钮时执行
 */
var jsId = "detail_view_head_js"+_mui_view_index;
var _menu_name = JSParm(jsId,"_menu_name");
var _show_save = JSParm(jsId,"_show_save");

var writeHtml = ''+
'<div class="topBar">'+
'	<button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">'+
'		<div class="l">'+
'			<a class="arrow" href="javascript:void(0)"></a>'+
'		</div>'+
'	</button>'+
'	<h1>'+_menu_name+'</h1>'+
'	<button type="button" class="mui-right mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-right">'+
'		<div class="r" id="_dt_right_menu'+_mui_view_index+'" style="display:none;">'+
'			<a href="javascript:void(0)"></a>'+
'		</div>'+
'	</button>'+
'</div>';
document.write(writeHtml);

document.getElementById("_dt_right_menu"+_mui_view_index).addEventListener("tap",function(){
	try{
		var id = "detail_view_head_js"+this.getAttribute("id").substring(14);
		var _save_func = JSParm(id,"_save_func");
		if(_save_func != undefined && _save_func != null && _save_func != ""){
			eval(_save_func+"()");
		}
	}catch(e){
		
	}
});
try{
	if(_show_save == "1"){
		$("#_dt_right_menu"+_mui_view_index).css("display","");
	} else {
		$("#_dt_right_menu"+_mui_view_index).css("display","none");
	}
}catch(e){
	
}

_mui_view_index = _mui_view_index + 1;

$(document).ready(function() {
	//初始化单页view
	var viewApi = mui('#app').view({
		defaultPage: '#defaultPage'
	});
	var view = viewApi.view;
	(function($) {
		//处理view的后退与webview后退
		var oldBack = $.back;
		$.back = function() {
			if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
				viewApi.back();
			} else { //执行webview后退
				oldBack();
			}
		};
		//监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
		//第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
		view.addEventListener('pageBeforeShow', function(e) {
			//				console.log(e.detail.page.id + ' beforeShow');
		});
		view.addEventListener('pageShow', function(e) {
			//				console.log(e.detail.page.id + ' show');
		});
		view.addEventListener('pageBeforeBack', function(e) {
			//				console.log(e.detail.page.id + ' beforeBack');
		});
		view.addEventListener('pageBack', function(e) {
			//				console.log(e.detail.page.id + ' back');
		});
	})(mui);
});