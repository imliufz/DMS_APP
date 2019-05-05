/**
 * 必传参数：_active_url 当前活动菜单地址
 */
var jsId = "index_buttom_js";
var _active_url = JSParm(jsId,"_active_url");
var isHaveFwgwRole = getLocalStorage("HAVE_FWGW_ROLE");
var isHaveZxRole = getLocalStorage("HAVE_ZX_ROLE");

var writeHtml = ''+
//'<br/><br/><br/><br/>'+
'<div  class="menu xf-res-menu">'+
'            <ul>'+
'                <li toPage="index.html" menuNum="1" id="menu_clue" style="display:none;">'+
'                	 <a style="background-size:30%" href="javascript:void(0);" toPage="index.html" id="m1" class="home" dat="长安风尚轿车销售" ></a>'+
'                    <span>线索</span>'+
'                </li>'+
'                <li toPage="remind.html" menuNum="2" id="menu_remind" style="display:none;">'+
'                	 <a style="background-size:30%" href="javascript:void(0);" toPage="remind.html" id="m2" class="alert" dat="提醒" ></a>'+
'                    <span>提醒</span>'+
/*'                <li toPage="complaint.html" menuNum="2" id="menu_complaint" style="display:none;">'+
'                	 <a href="javascript:void(0);" toPage="complaint.html" id="m2" class="alert" dat="投诉" ></a>'+
'                    <span>投诉</span>'+*/
'                </li>'+
'                <li toPage="report_list.html" menuNum="3" id="menu_report" style="display:none;">'+
'					 <a style="background-size:30%" href="javascript:void(0);" toPage="report_list.html" id="m3" class="report" dat="报表" ></a>'+
'                    <span>报表</span>'+
'                </li>';
if(!IsNull(isHaveZxRole) && isHaveZxRole == '1'){
	writeHtml += '                <li menuNum="4" id="menu_zxapp">'+
'					 <a style="background-size:30%" href="javascript:void(0);" toPage="" id="m4" class="zxapp" dat="尊享" ></a>'+
'                    <span>尊享</span>'+
'                </li>';
}
writeHtml +=
'                <li toPage="mine.html"  menuNum="5" id="menu_mine">'+
'                	 <a style="background-size:30%" href="javascript:void(0);" id="m5" toPage="mine.html" class="mine" dat="我的" ></a>'+
'                    <span>我的</span>'+
'                </li>'+
'            </ul>'+
'        </div>';
document.write(writeHtml);
if(_active_url != undefined && _active_url != null && _active_url != "") {
	$("a[toPage='"+_active_url+"']").attr("class",$("a[toPage='"+_active_url+"']").attr("class")+"_active");
};

//添加列表项的点击事件
mui('.menu').on('tap', 'li', function(e) {
	var toPage = this.getAttribute("toPage");
	if(!IsNull(toPage)){
		var curHref = window.location.href.substring(window.location.href.lastIndexOf("/")+1,window.location.href.length);
		if(curHref == toPage) {
			return;
		}
	}
	var oldMenuNum = parseInt($("li[toPage='"+_active_url+"']").attr("menuNum"));
	var newMenuNum = parseInt(this.getAttribute("menuNum"));
	var animationTypeShow = "1";
	if(oldMenuNum > newMenuNum) {
		animationTypeShow = "2";
	}
	if(IsNull(toPage) && newMenuNum == 4){//尊享APP
		toZxApp();
		return;
	}
	//ToUrl(toPage,animationTypeShow);
	mui.openWindow({
		url: toPage,
		id: toPage,
		show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true  
					aniShow: animationTypeShow, //页面显示动画，默认为”slide-in-right“；  
					duration: "200" //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；  
		},
		createNew:false,
		waiting: {
					autoShow: true, //自动显示等待框，默认为true  
					title: '正在加载...', //等待对话框上显示的提示内容  
					options: {
						width: "120px", //等待框背景区域宽度，默认根据内容自动计算合适宽度  
						height: "80px", //等待框背景区域高度，默认根据内容自动计算合适高度  
			}
		}
	})
	setTimeout(function(){
		try{
			plus.nativeUI.closeWaiting();
		}catch(e){
		}
	},2000);
});

function rsiz(){
	var wdo = $(window);
	var ls = $(".menu ul li");
	var lsCount = 0;
	for (var i = 0;i<ls.length;i++) {
		if(ls[i].style.display != "none"){
			lsCount++;
		}
	}
	ls.width(parseInt(wdo.width()/lsCount));
};
function toZxApp(){
	var url = httpUrlHead+"PotcusAchieveService/getZxUrl.json?"+httpUrlEnd;
	makeFormCall(url,function(json){
		if(json.RESULT.funcStatus == "1"){
			var url = json.url;
			if(!IsNull(url)){
				ToUrl(url);
			}else{
				MuiAlert("尊享APP地址配置不正确");
			}
		}
	},"fm");
}
mui.os.plus && !mui.os.stream && mui.plusReady(function(){
	var isHaveFwgwRole = getLocalStorage("HAVE_FWGW_ROLE");
	var IS_HAVE_JUMP = getLocalStorage("IS_HAVE_JUMP");//是否跳转尊享APP
	if(!IsNull(isHaveFwgwRole) && isHaveFwgwRole == '1' && !IsNull(IS_HAVE_JUMP) && IS_HAVE_JUMP == '0' ){
		setLocalStorage("IS_HAVE_JUMP","1");
		//有服务顾问权限自动跳转到尊享APP页面
	    MuiLoading("正在打开尊享APP...");
	    setTimeout('toZxApp()',1000);
	}
});
