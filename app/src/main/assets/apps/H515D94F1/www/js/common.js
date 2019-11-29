/**
 * author liufazhong
 * 通用JS
 */
$(document).ready(function() {
	var setDate = true;
	var i = document.createElement('input');
	i.setAttribute('type', 'date');
	//浏览器不支持date类型
	if(true){
		setDate = true;
		$('input[type="datetime-local"]').each(function(i,dateObj){
			(function($){
				if(!dateObj.disabled && !dateObj.readOnly){
					dateObj.addEventListener('tap', function() {
						var objValue = dateObj.value;
						if(IsNull(objValue)){
							objValue = _getNowFormatDate(new Date(),"2");
						} else {
							objValue = objValue.substr(0,10)+" "+objValue.substr(11,5);
						}
						var options = JSON.parse('{"value":"'+objValue+'"}');
						var picker = new $.DtPicker(options);
						picker.show(function(rs) {
							dateObj.value = rs.text.substr(0,10)+"T"+rs.text.substr(11,5);
							picker.dispose();
						});
					});
				}
			})(mui)
		});
	}
	
	//js通用初始化 给时间框增加清除按钮
	$('input[type="date"],input[type="time"]').each(function(i,dateObj){
		var flag = $(this).attr("clearBtn");
		if(flag == "true"){
		} else {
			var clearBtn = '<input name="clearBtn" type="button" value="清除" class="px"  style="width: 30%;" onclick="javascript:$(this).prev().val(\'\');$(\'#\'+$(this).prev().attr(\'name\')+\'_h\').val(\'@_@\');"/>';
			$(this).css("float","left").css("width","70%");
			$(this).after(clearBtn);
		}
		
		//设置MUI选择框
		if(setDate && !dateObj.disabled && !dateObj.readOnly){
			(function($){
				dateObj.addEventListener('tap', function() {
					var objValue = dateObj.value;
					if(IsNull(objValue)){
						if (dateObj.type == "time") {
							objValue = _getNowFormatDate(new Date(),"2");
						} else {
							objValue = _getNowFormatDate(new Date(),"1");
						}
					} else {
						if (dateObj.type == "time") {
							objValue = _getNowFormatDate(new Date(),"1") + " " + objValue;
						}
					}
					var options = JSON.parse('{"type":"'+dateObj.type+'","value":"'+objValue+'"}');
					//var optionsJson = this.getAttribute('data-options') || '{}';
					//var options = JSON.parse('{"type":"date"}');
					//var id = this.getAttribute('id');
					/*
					 * 首次显示时实例化组件
					 * 示例为了简洁，将 options 放在了按钮的 dom 上
					 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
					 */
					var picker = new $.DtPicker(options);
					picker.show(function(rs) {
						/*
						 * rs.value 拼合后的 value
						 * rs.text 拼合后的 text
						 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
						 * rs.m 月，用法同年
						 * rs.d 日，用法同年
						 * rs.h 时，用法同年
						 * rs.i 分（minutes 的第二个字母），用法同年
						 */
						dateObj.value = rs.text;
						try{dateObj.onchange();}catch(e){}
						//result.innerText = '选择结果: ' + rs.text;
						/* 
						 * 返回 false 可以阻止选择框的关闭
						 * return false;
						 */
						/*
						 * 释放组件资源，释放后将将不能再操作组件
						 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
						 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
						 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
						 */
						picker.dispose();
					});
				});
			})(mui)
		}
	});
	//短信按钮模板调用加载
	$("img[name='callMsg']").click(function(){
		var phone = $("#contactorMobile").val();
		if(IsNull(phone)){
			phone = $("#CONTACTOR_MOBILE").val();
		}
		//短信数据加载
		var url = httpUrlHead+"PotcusAchieveService/queryMsgList.json?"+httpUrlEnd;
    	makeFormCall(url,function(json){
    		if(json.RESULT.funcStatus == '1'){
	    		if (json.msgList != null && json.msgList.length > 0) {
	    			var appendHtml = '<ul class="round"><table id="tb_query">';
	    			for(var i = 0;i < json.msgList.length;i++) {
						appendHtml += '<tr class="biaoge"><td class="msgTd" style="height: 35px;border: none;width: 100%;font-size: 16px;" id="'+json.msgList[i].ID+'"><li class="nob" >'+json.msgList[i].TITLE;
						appendHtml += '</li></td><td style="display:none">'+json.msgList[i].CONTENT+'</td></tr>';
					}
					appendHtml += "</table></ul>";
					layer.open({
					    title: '短信模板',
					    content: appendHtml,
					    cancel: function(){
					    	sendMsg(phone,'');
					    }      
					});
					$(".msgTd").click(function(){
						var content = $(this).next().text();
						sendMsg(phone,content);
						layer.closeAll();
					});
				}else{
					sendMsg(phone,'');
				}
    		} else {
    			MuiAlert("查询失败!请联系管理员");
    		}
    	},"fm");	
	});
});
//注销
function _loginOut(){
	//验证是否记住密码
	if(getLocalStorage("IS_REMEMBER")=="10041002"){
		//移除cookie
		removeLocalStorage("LOGIN_CODE");
		removeLocalStorage("LOGIN_PWD");
	}
	//移除sessionStorage
	removeLocalStorage("IS_MANAGER");
	removeLocalStorage("LOGIN_MENU");
	removeLocalStorage("logonUser");
	ToUrl("login.html",2);
}

//首页
function _mainPage(menuType){
	if(menuType == '4'){//返回今日待跟进报表页面
		_toBack("followToday.html");
	}else if(menuType == '5') {//返回首次跟进报表页面
		_toBack("First_followUp.html");
	}else{
		ToUrl("index.html",2);
	}
}
//问题上报
function _problemReport(){
	ToUrl("problemReportList.html");
}

//跳转页面
function _toPage(page){
	ToUrl(page);
}

//返回
function _toBack(reloadUrl){
	if(reloadUrl != undefined && reloadUrl != null && reloadUrl != ""){
		try{
			var backPage = plus.webview.getWebviewById(reloadUrl.split(".")[0]);
			mui.fire(backPage,"backFunction");
		}catch(e){
			//TODO handle the exception
		}
	}
	setTimeout(function(){
		mui.back();
	},"1");
}

//返回
function _back() {
	try {
		if(changeFlag == true) {
			MuiConfirm("页面尚未保存，返回会造成输入的数据丢失，确认返回吗?",function(e){
				if(e.index == 0){
					setTimeout(function(){
						mui.back();
					},"1");
				}
			});
		} else {
			mui.back();
		}
	} catch(e){
		mui.back();
	}
}

function _loadMenu(menuType){
	var IS_MANAGER = getLocalStorage("IS_MANAGER");
	if(IS_MANAGER != "10041001" && IS_MANAGER != "10041002") {
		MuiAlert("当前登录用户失效,请重新登录!",function(){
			ToUrl("login.html",2);
		});
		return;
	}
	var LOGIN_MENU = getLocalStorage("LOGIN_MENU");
	if(LOGIN_MENU == undefined || LOGIN_MENU == null || LOGIN_MENU == ""){
		MuiAlert("当前登录用户失效,请重新登录!",function(){
			ToUrl("login.html",2);
		});
		return;
	}
	try{
		var json = eval("("+LOGIN_MENU+")");
		$("#logonName").html(json.logonName);
		if(json.dealerShortName.length > 11){
			$("#dealerName").html(json.dealerShortName.substring(0,11));
		} else {
			$("#dealerName").html(json.dealerShortName);
		}
		try{dealerShortName = json.dealerShortName;}catch(e){}
		//底部菜单的显示
		for (var i=0;i<json.menuList.length;i++){
			if(json.menuList[i].MENUTYPE=="105030"){
				$("#menu_clue").show();
			} else if(json.menuList[i].MENUTYPE=="105530"){
				try{$("#tsManage").show();}catch(e){}
				//$("#menu_complaint").show();
			} else if(json.menuList[i].MENUTYPE=="105630"){
				$("#menu_report").show();
			} else if(json.menuList[i].MENUTYPE=="105730"){
				$("#menu_remind").show();
			}
		}
		//功能菜单显示
		for (var i=0;i<json.menuList.length;i++){
			if(json.menuList[i].MENUTYPE==menuType){
				$("#"+json.menuList[i].MENUID).show();
			}
		}
		try{rsiz();}catch(e){}
	}catch(e){
		MuiAlert("当前登录用户失效,请重新登录!",function(){
			ToUrl("login.html",2);
		});
		return;
	}
	
}

//Form验证(只支持android)
function _validForm(id,showTxt,regTxt){
	var fd = document.getElementById(id);
	var jFd = $("#"+id);
	if (fd == undefined) {
		return true;
	}
	fd.setCustomValidity("");
	if (jFd.is(":hidden")) {
		return true;
	}
	if (regTxt != undefined && regTxt != null && regTxt != "") {
		if(fd.value == null || fd.value == "" || fd.value == "null" || fd.value == "NULL" || fd.value == "undefined" || fd.value == undefined){
			fd.setCustomValidity("请填写此字段。");
			return false;
		} else {
			var pattern = new RegExp(regTxt);
			if (!pattern.exec(fd.value)) {
				fd.setCustomValidity(showTxt);
				return false;
			}
		}
	} else {
		if (showTxt == undefined || showTxt == null || showTxt == "") {
			showTxt = "请填写此字段。";
		}
		if(fd.value == null || fd.value == "" || fd.value == "null" || fd.value == "NULL" || fd.value == "undefined" || fd.value == undefined){
			fd.setCustomValidity(showTxt);
			return false;
		}
	}
	return true;
}

//查询条件展开和收起
function _showQuery(type){
	if(document.getElementById("txt_query").style.display == "none"){
		return false;
	}
	var txtQuery = document.getElementById("txt_query").innerHTML;
	if (type == "1") {
		document.getElementById("txt_query").innerHTML = "展开";
		document.getElementById("tb_query").style.display = "none";
		isFiexd(true);
	} else if(type == "2"){
		document.getElementById("txt_query").innerHTML = "收起";
		document.getElementById("tb_query").style.display = "";
		isFiexd(false);
	} else {
		if(txtQuery == "展开") {
			document.getElementById("txt_query").innerHTML = "收起";
			document.getElementById("tb_query").style.display = "";
			isFiexd(false);
		} else {
			document.getElementById("txt_query").innerHTML = "展开";
			document.getElementById("tb_query").style.display = "none";
			isFiexd(true);
		}
	}
	$(".contip").toggle();
}

function isFiexd(flag){
	if(flag){
		$("#txt_query").parents('.round').css({"position":"fixed" ,"width":"100%","zIndex":"1"});
		$("#tabList").css({"zIndex":"1","marginTop":"40px"});
	} else {
		$("#txt_query").parents('.round').css({"position":"static" ,"width":"100%","zIndex":"1"});
		$("#tabList").css({"zIndex":"1","marginTop":"0px"});
		document.getElementsByTagName('body')[0].scrollTop = 0;
	}
}

//获取页面TC_CODE
function _loadTcCode(){
	var pageArguments = arguments;
	var n = pageArguments.length;
	if (n <= 0 || n%2 != 0) {
		return;
	}
    var codeTypes = "";
    for (var i = 0; i < n/2; i++) {
    	if(i == n/2 - 1){
    		codeTypes = codeTypes + pageArguments[i];
    	} else {
    		codeTypes = codeTypes + pageArguments[i]+",";
    	}
    }
	var url = httpUrlHead+"PotcusAchieveService/queryTcCode.json?codeTypes="+codeTypes+"&"+httpUrlEnd;
	makeFormCall(url,function(json){
		if(json.RESULT.maps != null && json.RESULT.maps.length > 0) {
			for ( var x = 0; x < n/2; x++) {
				var codes = null;
				for (var key in json.RESULT.maps[0]) {
					if ("T"+pageArguments[x] == key) {
						codes = json.RESULT.maps[0][key];
						break;
					}
				}
				if(codes != null && codes.length > 0) {
					var tc = document.getElementById(""+pageArguments[x+n/2]+"");
					var jTc = $("#"+pageArguments[x+n/2]).attr("defaultValue");
					var notInTc = $("#"+pageArguments[x+n/2]).attr("exceptValue");
					var except = new Array();
					if(notInTc != undefined && notInTc != null && notInTc != "") {
						except = notInTc.split(",");
					}
					tc.options.length = 0;
					tc.add(new Option("-请选择-",""));
					for(var i = 0;i < codes.length;i++){
						var addTc = true;
						if(except != null && except.length > 0) {
							for(var ex = 0;ex < except.length;ex++) {
								if(codes[i].CODE_ID == except[ex]){
									addTc = false;
									break;
								}
							}
						}
						if(addTc){
							tc.options.add(new Option(codes[i].CODE_DESC,codes[i].CODE_ID));
						}
					}
					if(!IsNull(jTc)){
						tc.value = jTc;
					}
				}
			}
		}
		if(typeof(se_loadStatus) != "undefined"){
			se_loadStatus++;
			loadSelectRes();
		}
	},"fm");
}

//获取页面TC_CODE并调用查询条件初始化方法
function _loadTcCodeAndCallBack(){
	var pageArguments = arguments;
	var n = pageArguments.length;
	if (n <= 0 || n%2 != 0) {
		return;
	}
    var codeTypes = "";
    var isHaveIntentSeries = false;
    var isSalesConsultant = false;
    for (var i = 0; i < n/2; i++) {
    	if (pageArguments[i] == "4"){ // 意向车系
    		isHaveIntentSeries = true;
    	} else {
    		if(i == n/2 - 1){
	    		codeTypes = codeTypes + pageArguments[i];
	    	} else {
	    		codeTypes = codeTypes + pageArguments[i]+",";
	    	}
    	}
    }
    if(isHaveIntentSeries){//意向车系
    	$("#intentSeries").append("<option value=''>-请选择-</option>");
    	_loadSeries("intentSeries");
    }
	var url = httpUrlHead+"PotcusAchieveService/queryTcCode.json?codeTypes="+codeTypes+"&"+httpUrlEnd;
	makeFormCall(url,function(json){
		if(json.RESULT.maps != null && json.RESULT.maps.length > 0) {
			for ( var x = 0; x < n/2; x++) {
				var codes = null;
				for (var key in json.RESULT.maps[0]) {
					if ("T"+pageArguments[x] == key) {
						codes = json.RESULT.maps[0][key];
						break;
					}
				}
				if(codes != null && codes.length > 0) {
					var tc = document.getElementById(""+pageArguments[x+n/2]+"");
					var jTc = $("#"+pageArguments[x+n/2]).attr("defaultValue");
					var notInTc = $("#"+pageArguments[x+n/2]).attr("exceptValue");
					var except = new Array();
					if(notInTc != undefined && notInTc != null && notInTc != "") {
						except = notInTc.split(",");
					}
					for(var i = 0;i < codes.length;i++){
						var addTc = true;
						if(except != null && except.length > 0) {
							for(var ex = 0;ex < except.length;ex++) {
								if(codes[i].CODE_ID == except[ex]){
									addTc = false;
									break;
								}
							}
						}
						if(addTc){
							tc.options.add(new Option(codes[i].CODE_DESC,codes[i].CODE_ID));
						}
					}
					if(!IsNull(jTc)){
						tc.value = jTc;
					}
				}
			}
		}
		if(typeof(se_loadStatus) != "undefined"){
			se_loadStatus++;
			loadSelectRes();
		}
		initSearch();
	},"fm");
}

//查询条件初始化
function initSearch() {
	$("[search='show']").each(function(){
		var showName = $(this).attr("name");
		var hideName = showName + "_h";
		$(this).blur(function(){
			if($(this).val()!=""){
				$("#"+hideName).val($(this).val());
			} else {
				$("#"+hideName).val("@_@"); //用户主动清空用特殊字符代替空字符串
			}
		});
		var hideValue = $("#"+hideName).val();
		if( hideValue != "" ) {
			$(this).val(hideValue);
		} else if (hideValue == "@_@"){
			$(this).val("");
		}
	});
	queryPt();
}

//加载所有意向车系数据
function _loadSeries(seriesId){
	var url = httpUrlHead+"PotcusAchieveService/querySMPC.json?codeType=4&"+httpUrlEnd;
	makeFormCall(url, function(json){
		if(json.RESULT.funcStatus == "1") {
			var series = document.getElementById(seriesId);
			var list = json.list;
			if(list != null && list.length > 0) {
				var jTc = $("#"+seriesId).attr("defaultValue");
				for(var i = 0;i < list.length;i++) {
					series.add(new Option(list[i].GROUP_NAME,list[i].GROUP_CODE));
				}
				if (jTc != undefined && jTc != null && jTc != "") {
					$(series).val(jTc);
				}
			}
		} else {
			MuiAlert("加载数据失败!");
		}
		if(typeof(se_loadStatus) != "undefined"){
			se_loadStatus++;
			loadSelectRes();
		}
	}, "fm");
}

//车系车型配置颜色联动
function _changeSMPC(code,codeType) {
	var smpc = null;
	var defaultValue = null;
	if (codeType == "1") {
		smpc = document.getElementById("intentModel");
		defaultValue = $("#intentModel").attr("defaultValue");
		document.getElementById("intentModel").options.length=0;
		document.getElementById("intentPackage").options.length=0;
		document.getElementById("color").options.length=0;
	} else if(codeType == "2") {
		smpc = document.getElementById("intentPackage");
		defaultValue = $("#intentPackage").attr("defaultValue");
		document.getElementById("intentPackage").options.length=0;
		document.getElementById("color").options.length=0;
	} else if(codeType == "3") {
		smpc = document.getElementById("color");
		defaultValue = $("#color").attr("defaultValue");
		document.getElementById("color").options.length=0;
	} else {
		MuiAlert("数据类型错误!");
		return;
	}
	if (code == "") {
		loadSelectRes();
		return;
	}
	smpc.add(new Option("加载中...",""));
	var url = httpUrlHead+"PotcusAchieveService/querySMPC.json?code="+code+"&codeType="+codeType+"&"+httpUrlEnd;
	makeFormCall(url, function(json){
		smpc.options.length=0;
		smpc.add(new Option("-请选择-",""));
		if(json.RESULT.funcStatus == "1") {
			var list = json.list;
			if(list != null && list.length > 0) {
				var selIndex = -1;
				for(var i = 0;i < list.length;i++) {
					smpc.add(new Option(list[i].GROUP_CODE+" "+list[i].GROUP_NAME,list[i].GROUP_CODE));
					if (defaultValue != undefined && defaultValue != null && defaultValue != "" && defaultValue == list[i].GROUP_CODE) {
						selIndex = i;
					}
				}
				if (selIndex >= 0) {
					smpc.options[selIndex+1].selected = true;						
				}
				if (codeType == "1") {
					$("#intentModel").attr("defaultValue","");
				} else if(codeType == "2") {
					$("#intentPackage").attr("defaultValue","");
				} else if(codeType == "3") {
					$("#color").attr("defaultValue","");
				}
			}
		} else {
			MuiAlert("加载数据失败!");
		}
		loadSelectRes();
	}, "fm");
}

//车系车型配置颜色联动
function _changeSMPCDynamic(model, config, color, code, codeType) {
	if (code == "") {
		return;
	}
	var smpc = null;
	var defaultValue = null;
	if (codeType == "1") {
		smpc = document.getElementById(model);
		defaultValue = $("#"+model).attr("defaultValue");
		document.getElementById(model).options.length=0;
		document.getElementById(config).options.length=0;
		document.getElementById(color).options.length=0;
	} else if(codeType == "2") {
		smpc = document.getElementById(config);
		defaultValue = $("#"+config).attr("defaultValue");
		document.getElementById(config).options.length=0;
		document.getElementById(color).options.length=0;
	} else if(codeType == "3") {
		smpc = document.getElementById(color);
		defaultValue = $("#"+color).attr("defaultValue");
		document.getElementById(color).options.length=0;
	} else {
		MuiAlert("数据类型错误!");
		return;
	}
	smpc.add(new Option("加载中...",""));
	var url = httpUrlHead+"PotcusAchieveService/querySMPC.json?code="+code+"&codeType="+codeType+"&"+httpUrlEnd;
	makeFormCall(url, function(json){
		smpc.options.length=0;
		smpc.add(new Option("-请选择-",""));
		if(json.RESULT.funcStatus == "1") {
			var list = json.list;
			if(list != null && list.length > 0) {
				var selIndex = -1;
				for(var i = 0;i < list.length;i++) {
					smpc.add(new Option(list[i].GROUP_NAME,list[i].GROUP_CODE));
					if (defaultValue != undefined && defaultValue != null && defaultValue != "" && defaultValue == list[i].GROUP_CODE) {
						selIndex = i;
					}
				}
				if (selIndex >= 0) {
					smpc.options[selIndex+1].selected = true;						
				}
				if (codeType == "1") {
					$("#"+model).attr("defaultValue","");
				} else if(codeType == "2") {
					$("#"+config).attr("defaultValue","");
				} else if(codeType == "3") {
					$("#"+color).attr("defaultValue","");
				}
			}
		} else {
			MuiAlert("加载数据失败!");
		}
	}, "fm");
}

//加载所有战败品牌
function _loadFailSeries(failBranId){
	var failBran = document.getElementById(failBranId);
	failBran.options.length = 0;
	failBran.add(new Option("加载中...",""));
	var url = httpUrlHead+"PotcusAchieveService/queryFailBranSeries.json?"+httpUrlEnd;
	makeFormCall(url, function(json){
		failBran.options.length = 0;
		failBran.add(new Option("-请选择-",""));
		if(json.RESULT.funcStatus == "1") {
			var list = json.failList;
			if(list != null && list.length > 0) {
				for(var i = 0;i < list.length;i++) {
					failBran.add(new Option(list[i].FAILBRAN_NAME,list[i].FAILBRAN_NAME));
				}
			}
		} else {
			MuiAlert("加载数据失败!");
		}
	}, "fm");
}

//根据战败品牌获取战败车系
function _changeFailBran(failBranCode,failSeriesId){
	var failSeries = document.getElementById(failSeriesId);
	failSeries.options.length = 0;
	failSeries.add(new Option("加载中...",""));
	var url = httpUrlHead+"PotcusAchieveService/queryFailBranSeries.json?FAILBRAN_NAME="+encodeURI(encodeURI(failBranCode))+"&"+httpUrlEnd;
	makeFormCall(url, function(json){
		failSeries.options.length = 0;
		failSeries.add(new Option("-请选择-",""));
		if(json.RESULT.funcStatus == "1") {
			var list = json.failList;
			if(list != null && list.length > 0) {
				for(var i = 0;i < list.length;i++) {
					$("#"+failSeriesId).append("<option value='"+list[i].ID+"'>"+list[i].FAILSER_NAME+"</option>");
					//failSeries.add(new Option(list[i].FAILSER_NAME,list[i].ID));
				}
			}
		} else {
			MuiAlert("加载数据失败!");
		}
		loadSelectRes();
	}, "fm");
}

//加载所有战败车型
function _loadFailModel(failModelId){
	var failModel = document.getElementById(failModelId);
	failModel.options.length = 0;
	failModel.add(new Option("加载中...",""));
	var url = httpUrlHead+"PotcusAchieveService/queryFailModel.json?"+httpUrlEnd; 
	makeFormCall(url, function(json){
		failModel.options.length = 0;
		failModel.add(new Option("-请选择-",""));
		if(json.RESULT.funcStatus == "1") {
			var list = json.failModelList;
			if(list != null && list.length > 0) {
				for(var i = 0;i < list.length;i++) {
					failModel.add(new Option(list[i].failModelDesc,list[i].failModelCode));
				}
			}
		} else {
			MuiAlert("加载数据失败!");
		}
	}, "fm");
}

var CON_H_DAY,CON_H_CX_DAY,CON_A_DAY,CON_A_CX_DAY,CON_B_DAY,CON_B_CX_DAY,
CON_C_DAY,CON_C_CX_DAY,CON_N_DAY,CON_N_CX_DAY,CON_FO_DAY,CON_FO_CX_DAY,CON_O_DAY,CON_O_CX_DAY;
function _loadPotcusLevel(){
	try {
		CON_H_DAY = parseInt(getLocalStorage("H_DAY"));
		CON_H_CX_DAY = parseInt(getLocalStorage("H_CX_DAY"));
		CON_A_DAY = parseInt(getLocalStorage("A_DAY"));
		CON_A_CX_DAY = parseInt(getLocalStorage("A_CX_DAY"));
		CON_B_DAY = parseInt(getLocalStorage("B_DAY"));
		CON_B_CX_DAY = parseInt(getLocalStorage("B_CX_DAY"));
		CON_C_DAY = parseInt(getLocalStorage("C_DAY"));
		CON_C_CX_DAY = parseInt(getLocalStorage("C_CX_DAY"));
		CON_N_DAY = parseInt(getLocalStorage("N_DAY"));
		CON_N_CX_DAY = parseInt(getLocalStorage("N_CX_DAY"));
		CON_FO_DAY = parseInt(getLocalStorage("FO_DAY"));
		CON_FO_CX_DAY = parseInt(getLocalStorage("FO_CX_DAY"));
		CON_O_DAY = parseInt(getLocalStorage("O_DAY"));
		CON_O_CX_DAY = parseInt(getLocalStorage("O_CX_DAY"));
	} catch (e) {
		MuiAlert("登录已失效,请重新登录",function(){
			_loginOut();
		});
	}
}
function sendMsg(tel,content){
    var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
    msg.to = [tel];
    msg.body = content;
    plus.messaging.sendMessage( msg );
}

function addCssLink(src) {
    var link = document.createElement("link");
    link.rel = "stylesheet"
    link.type = "text/css";
    link.href = src;
    document.getElementsByTagName("head")[0].appendChild(link);
}