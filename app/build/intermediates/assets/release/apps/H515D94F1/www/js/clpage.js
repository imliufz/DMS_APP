/**
 * author liufazhong
 * 数据列表
 */

var _isLoading = false;
var _curPage = 0;
var T_url,T_fm,T_colorType,T_btnTxt,T_isCheckBox,T_nextFunc1,T_nextFunc2,T_str1,T_str2,T_str3,T_str4,T_str5,T_str6,T_str7;
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
function _complaint_query(url,fm,colorType,btnTxt,isCheckBox,nextFunc1,nextFunc2,str1,str2,str3,str4,str5,str6,str7){
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
	T_str6 = str6;
	T_str7 = str7;
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
	var str6 = T_str6;
	var str7 = T_str7;

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
				var value6 = "";
				var value7 = "";
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
					if(value6 == "" && str6 == key) {
						value6 = $.trim(json.RESULT.maps[i][key]);
					}
					if(value7 == "" && str7 == key) {
						value7 = $.trim(json.RESULT.maps[i][key]);
					}
				}
				var isCq = null;
				if (colorType) {
					isCq = 0;
				}
				tabBody += _tabCol(isCq, maps[i].WS_NUM, maps[i].ID, maps[i].SR_SEV_CD, maps[i].LAST_NAME, maps[i].WS_STATUS, maps[i].ASSIGNED_DT,maps[i].DUE_DT,maps[i].CELL_PH_NUM, isCheckBox, btnTxt, nextFunc1+"('"+maps[i].ID+"','"+maps[i].WS_NUM+"');",nextFunc2+"('"+maps[i].WS_NUM+"','"+btnTxt+"');", value1, value2, value3,value4,value5,value6,value7,i+1);
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
		//短信按钮模板调用加载
		$("img[name='callMsg']").click(function(){
			jwlFlag=false;
			var phone = $(this).attr("phone");
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
					}
	    		} else {
	    			MuiAlert("查询失败!请联系管理员");
	    		}
	    	},"fm");	
		});
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

function _tabCol(colorType,wsNum,id,srSevCd,lastName,wsStatus,assignedDt,dueDt,cellPhNum,isCheckbox,btnTxt,nextFunc1,nextFunc2,str1,str2,str3,str4,str5,str6,str7,num){
	//if(cusName != null && cusName != undefined && cusName.length > 6) {
		//cusName = cusName.substring(0,6);
	//}
	
	if (wsStatus != '已处理') {
		if (new Date() - new Date(dueDt.replace(/-/g,"/")) >= 0) {
			colorType = "0";
		} else if ((new Date(dueDt.replace(/-/g,"/")) - new Date()) /3600000 <= 24) {
			colorType = "2";
		}
	}
	var color = "weimob-list-itemgreen";//默认绿色
//	if(colorType == "0") {
//		color = "weimob-list-itemred";//红
//	} else if (colorType == "1") {
//		color = "weimob-list-itemreddish";//淡红
//	} else if (colorType == "2") {
//		color = "weimob-list-item";//黄
//	} else if (colorType == "3") {
//		color = "weimob-list-itemgreen";//绿
//	}
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
		colBody += '<script>var jwlFlag = true;</script><a style="background-image: linear-gradient( #fff , #FFFFFF)" class="'+color+'" onclick=if(jwlFlag){'+nextFunc2+'}>';
	} else {
		colBody += '<script>var jwlFlag = true;</script><a style="background-image: linear-gradient( #fff , #FFFFFF)" class="'+color+'" onclick=if(jwlFlag){'+nextFunc2+'}jwlFlag=true;>';
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
					'			&nbsp;<a href="javascript:void(0);" onclick="'+nextFunc1+'">'+numStr+lastName+'&nbsp;&nbsp;'+cellPhNum+'&nbsp;&nbsp;</a>'+
					'			<img onClick="jwlFlag=false;window.location.href=\'tel:'+cellPhNum+'\';" style="margin-top:-5px;" height="21px;" src="static/img/bohao.png"></img>&nbsp;&nbsp;'+
					'			<img phone="'+cellPhNum+'" name="callMsg" style="margin-top:-5px;" height="21px;" src="static/img/duanxing.png"></img>'+
					'		</td>';
	}
	colBody += '<td  align="right">'+wsStatus+'&nbsp;&nbsp;&nbsp;</td>'+
	'	</tr>'+
	'</table>'+
	'</div>';
	if(colorType) {
		if (colorType == "0") {
			colBody +=  '<div class="weimob-list-itemgreen-image" style="background-image:url(images/x2.png)" ></div>';
		}
		if (colorType == "2") {
			colBody +=  '<div class="weimob-list-itemgreen-image" style="background-image:url(images/x4.png)" ></div>';
		}
	} else {
		colBody +=  '<div class="weimob-list-itemgreen-image" style="background-image:url(images/x1.png)" ></div>';
	}
	//'<div class="weimob-list-item-image" style="background-image:url(static/img/boy.png)" ></div>'+
	colBody += '		<div class="weimob-list-item-summary">'+
	'			<table>'+
	'				<tr>'+
	'					<td align="left" style="padding-left:45px;">工单号:'+wsNum+'</td>'+
	'					<td align="left">派发:'+assignedDt+'</td>'+
	'				</tr>'+
	'			</table>'+
	'		</div>'+
	'		<div class="weimob-list-item-summary">'+
	'			<table>'+
	'				<tr>'+
	'					<td align="left" style="padding-left:45px;">级别:'+srSevCd+'</td>'+
	'					<td align="left">到期:'+dueDt+'</td>'+
	'					<td align="left"><p   style="color:blue" >'+btnTxt+'</p></td>'+
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