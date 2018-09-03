/**
 * author liufazhong
 * 数据列表
 */

var _isLoading = false;
var _curPage = 0;
var T_url,T_fm,T_colorType,T_btnTxt,T_isCheckBox,T_nextFunc1,T_nextFunc2,T_str1,T_str2,T_str3,T_str4,T_str5;
/**
 * url 查询地址
 * fm 表单id
 * colorType 是否显示超期颜色 true/false
 * btnTxt 按钮显示的字；如果为空则不显示；如果为true则显示明细图标
 * isCheckBox 是否有选择框
 * nextFunc1 点击头像或电话执行的方法
 * nextFunc2 点击操作按钮（删除/退回/明细）执行的方法
 * str1 自定义显示字段1
 * str2 自定义显示字段2
 * str3 自定义显示字段3
 * str4 自定义显示字段4
 * str5 自定义显示字段5
 */
function _commnucation_query(url,fm,colorType,btnTxt,isCheckBox,nextFunc1,nextFunc2,str1,str2,str3,str4,str5){
	$("#tabList").html("<div style='text-align:center;'><img src='static/img/wait.jpg' width='64' height='64'/></div>");
	T_url = url;
	T_fm = fm;
	T_colorType = colorType;
	T_btnTxt = btnTxt;
	T_isCheckBox = isCheckBox;
	T_nextFunc1 = nextFunc1;
	T_nextFunc2 = nextFunc2;
	T_str1 = str1;
	T_str2 = str2;
	T_str3 = str3;
	T_str4 = str4;
	T_str5 = str5;
	_loadPageData("1");
	
}

function _loadPageData(loadType){
	var url = T_url;
	var fm = T_fm;
	var colorType = T_colorType;
	var btnTxt = T_btnTxt;
	var isCheckBox = T_isCheckBox;
	var nextFunc1 = T_nextFunc1;
	var nextFunc2 = T_nextFunc2;
	var str1 = T_str1;
	var str2 = T_str2;
	var str3 = T_str3;
	var str4 = T_str4;
	var str5 = T_str5;

	if (loadType == "1") {
		_curPage = 1;
	} else {
		$("#tabList").append("<div style='text-align:center;' class='_nextLoad'><img src='static/img/wait.jpg' width='64' height='64'/></div>");
		url = url + "&CUR_PAGE="+_curPage;
	}
	_isLoading = true;
	makeFormCall(url,function(json){
		if(json.RESULT.maps != null && json.RESULT.maps.length > 0) {
			var maps = json.RESULT.maps;
			var tabBody = "";
			for(var i = 0;i < maps.length;i++) {
				var value1 = "";
				var value2 = "";
				var value3 = "";
				var value4 = "";
				var value5 = "";
				for (var key in json.RESULT.maps[i]) {
					if(value1 == "" && str1 == key){
						value1 = json.RESULT.maps[i][key];
					}
					if(value2 == "" && str2 == key){
						value2 = json.RESULT.maps[i][key];
					}
					if(value3 == "" && str3 == key){
						value3 = json.RESULT.maps[i][key];
					}
					if(value4 == "" && str4 == key) {
						value4 = json.RESULT.maps[i][key];
					}
					if(value5 == "" && str5 == key){
						value5 = json.RESULT.maps[i][key];
					}
				}
				var isCq = null;
				if (colorType) {
					isCq = 0;
				}
				tabBody += _tabCol(isCq, maps[i].SE_ID, maps[i].CALLED_FROM_NUM, maps[i].CALLED_NUM, maps[i].TODO_PLAN_START_DT, maps[i].TODO_PLAN_END_DT, isCheckBox, btnTxt, nextFunc1+"('"+maps[i].SE_ID+"','"+maps[i].CALLED_FROM_NUM+"');",nextFunc2+"('"+maps[i].SE_ID+"','"+btnTxt+"');", value1, value2, value3,value4,value5,i+1);
			}
			var totalRecords =  json.RESULT.totalRecords;
			var tophtml = "<div style='text-align:left;width='100%';height='64px;'><font style='margin-left: 12px;'>总共</font><font id='totleNum' style='color:blue;'> "+totalRecords+"</font> 条记录</div>";
			var tabHtml = tophtml+tabhtml1+tabBody+tabhtml2;
			var tabHtml2 = tabhtml1+tabBody+tabhtml2;
			if (loadType == "1") {
				$("#tabList").html(tabHtml);
			} else {
				$("._nextLoad").remove();
				$("#tabList").append(tabHtml2);
			}
			_curPage = _curPage + 1;
			_isLoading = false;
		} else {
			if (loadType == "1") {
				$("#tabList").html("<div style='text-align:center;'><font color='red'>无数据</font></div>");
			} else {
				$("._nextLoad").remove();
				$("#tabList").append("<div style='text-align:center;' class='_nextLoad'><font color='red'>没有更多数据</font></div>");
			}
			_isLoading = false;
		}
	},fm);
}

function doCallBack(fn,args) {
	return fn.apply(this,[args]);
}

function _checkBox(id){
	var checkbox = document.getElementById(id);
    if(checkbox.checked){
        checkbox.checked=false;
    }
    else{
        checkbox.checked=true;
    }
}

function _getSelectStrs(){
	var selStr = "";
	var cbArray = document.getElementsByName("userCheckBox");
	if(cbArray!=null && cbArray.length>0){
		for(var i=0;i<cbArray.length;i++){
			if(cbArray[i].checked) {
				selStr += cbArray[i].value+",";
			}
		}
	}
	if (selStr != null && selStr != "") {
		selStr = selStr.substr(0, selStr.length - 1);
	}
	return selStr;
}

function saveCallLog(tabType,id,cusPhone){
	var isClick = $("#_plh"+tabType+"_"+id).attr("isClick");
	if(isClick == "1"){
		//已经拨号，无需二次拨号
	} else {
		var url = httpUrlHead+"PotcusAchieveService/saveCallLog.json?id="+id+"&cusPhone="+cusPhone+"&"+httpUrlEnd;
		makeFormCall(url, function(json){}, "fm");
		$("#_plh"+tabType+"_"+id).attr("isClick","1");
	}
}

$(window).scroll(function(){
	if (!_isLoading && _curPage != 0) {
		var scrollTop = $(window).scrollTop();
		var windowHeight = $(window).height();
		var height = $(document).height();
		if (height-(scrollTop+windowHeight) <= 0) {
			_loadPageData("2");
		}
	}
});

function _tabCol(colorType,se_id,called_from_num,called_num,todo_plan_start_dt,todo_plan_end_dt,isCheckbox,btnTxt,nextFunc1,nextFunc2,str1,str2,str3,str4,str5,num){
	//if(cusName != null && cusName != undefined && cusName.length > 6) {
		//cusName = cusName.substring(0,6);
	//}
	
	if (called_from_num == "" || called_from_num == "null" || called_from_num == null) {
		called_from_num = "无";
	}
	if (called_num == "" || called_num == "null" || called_num == null) {
		called_num = "无";
	}
	if (todo_plan_start_dt == "" || todo_plan_start_dt == "null" || todo_plan_start_dt == null) {
		todo_plan_start_dt = "";
	}
	if (todo_plan_end_dt == "" || todo_plan_end_dt == "null" || todo_plan_end_dt == null) {
		todo_plan_end_dt = "";
	}
	var color = "weimob-list-itemgreen";//默认绿色
	if(colorType == "0") {
		color = "weimob-list-itemred";//红
	} else if (colorType == "1") {
		color = "weimob-list-itemreddish";//淡红
	} else if (colorType == "2") {
		color = "weimob-list-item";//黄
	} else if (colorType == "3") {
		color = "weimob-list-itemgreen";//绿
	}
//	var sexType = "boy";
//	if(sex == "10031002") {
//		sexType = "girl";
//	}
	var dtCss = "";
//	if (btnTxt == null || btnTxt == "null" || btnTxt == "") {
//		dtCss == null;
//	} else if(btnTxt == true || btnTxt == "true"){
//		dtCss = "weimob-list-item-icon icon-arrow-r";
//		btnTxt = "";
//	} else {
//		dtCss = "weimob-list-itemred-button";
//	}
	var colBody = '';
	if (isCheckbox) {
		colBody += '<script>var jwlFlag = true;</script><a class="'+color+'" onclick=if(jwlFlag){'+nextFunc2+'}>';
	} else {
		colBody += '<script>var jwlFlag = true;</script><a class="'+color+'" onclick=if(jwlFlag){'+nextFunc2+'}jwlFlag=true;>';
	}
	
	colBody += '<div class="weimob-list-item-title">'+
	'<table width="100%">'+
	'	<tr>';
	var numStr = "";
	if (_curPage <= 1){
		numStr = "  <font style='color:blue'>0"+num+"</font>  <font style='color:gray'>|</font>    ";
		if (num == 10) {
			numStr = "  <font style='color:blue'>"+num+"</font>  <font style='color:gray'>|</font>    ";
		}
	}else {
		var newNum = num + (_curPage-1)*10;
		numStr = "  <font style='color:blue'>"+newNum+"</font>  <font style='color:gray'>|</font>    ";
	}

	if (isCheckbox) {
		colBody +=  '		<td align="left">'+
					'			<input type="checkbox" value="'+tabType+'_'+id+'" id="'+tabType+'_'+id+'" name="userCheckBox" />'+numStr+cusName+'&nbsp;&nbsp;'+cusPhone+'&nbsp;&nbsp;</a>'+
					'		</td>';
	} else {
		colBody +=  '		<td align="left">'+
					'			&nbsp;<a href="javascript:void(0);" onclick="'+nextFunc1+'">'+numStr+'&nbsp;&nbsp;'+called_num+'&nbsp;&nbsp;</a>'+
					'			<img onClick="jwlFlag=false;sendMsg('+called_num+',\'\');" style="margin-top:-5px;" height="21px;" src="static/img/bohao.png"></img>&nbsp;&nbsp;'+
					'			<img onClick="jwlFlag=false;sendMsg('+called_num+',\'\');" style="margin-top:-5px;" height="21px;" src="static/img/duanxing.png"></img>'+
					'		</td>';
	}
	colBody += '<td  align="right"></td>'+
	'	</tr>'+
	'</table>'+
	'</div>'+
	'<div class="weimob-list-item-image" style="background-image:url(static/img/boy.png)" ></div>'+
	'		<div class="weimob-list-item-summary">'+
	'			<table>'+
	'				<tr>'+
	'					<td align="left" style="padding-left:55px;">开始时间:'+todo_plan_start_dt+'</td>'+
	'				</tr>'+
	'			</table>'+
	'		</div>'+
	'		<div class="weimob-list-item-summary">'+
	'			<table>'+
	'				<tr>'+
	'					<td align="left" style="padding-left:55px;">结束时间:'+todo_plan_end_dt+'</td>'+
	'					<td align="left"><a   style="color:blue" onclick="'+nextFunc2+'">'+btnTxt+'</a></td>'+
	'				</tr>'+
	'			</table>'+
	'		</div>'+
	'	</div>';
//	if (dtCss != null && dtCss != "") {
//		colBody += '<div class="'+dtCss+'"  onclick="'+nextFunc2+'">'+btnTxt+'</div>';
//	}
	colBody +='</a>';
	return colBody;
}
var tabhtml1 = '<div class="weimob-content">'+
' 				<div class="weimob-list">';
var tabhtml2 = '	</div>'+
'			</div>';