/**
 * author liufazhong
 * 数据列表
 */

var _isLoading = false;
var _curPage = 0;
var T_url, T_fm, T_colorType, T_btnTxt, T_isCheckBox, T_nextFunc1, T_nextFunc2, T_str1, T_str2, T_str3, T_str4, T_str5,
	T_str6, T_str7, T_str8;
var _isMoreData = true;
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
 * str6 自定义显示字段6
 */
function _exe_query(url, fm, colorType, btnTxt, isCheckBox, nextFunc1, nextFunc2, str1, str2, str3, str4, str5, str6,
	str7, str8) {
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
	T_str8 = str8;
	_loadPageData("1");
	_isMoreData = true;
}

function _loadPageData(loadType) {
	try {
		$("#queryBtn").css("background-color", "gray");
		$("#queryBtn").attr("disabled", true);
		if (loadType == "1") {
			$(".contip").remove(); //清除原先的智慧营销标签
		} else {
			setOnWisdomsalesType();
		}
	} catch (e) {

	}
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
	var str8 = T_str8;
	if (loadType == "1") {
		_curPage = 1;
	} else {
		$("#tabList").append(
			"<div style='text-align:center;' class='_nextLoad'><img src='static/img/wait.jpg' width='64' height='64'/></div>");
		url = url + "&CUR_PAGE=" + _curPage;
	}
	try {
		if (_pageSize != undefined && _pageSize != null && _pageSize != "") {
			url = url + "&PAGE_SIZE=" + _pageSize;
		}
	} catch (e) {

	}
	_isLoading = true;
	makeFormCall(url, function(json) {
		//增加360视图判断
		//		var view360Flag = json.view360Flag;
		//		if( !IsNull(view360Flag) && view360Flag == "1"){
		//			var contactorMobile = json.contactorMobile;
		//			MuiConfirm("本店无数据,是否跳转360视图？",function (e){
		//				if(e.index == 0){
		//					ToUrl("view360.html?contactorMobile="+contactorMobile);
		//					return false;
		//				}
		//			},null,"1");
		//		}
		if (json.RESULT.maps != null && json.RESULT.maps.length > 0) {
			var maps = json.RESULT.maps;
			var tabBody = "";
			for (var i = 0; i < maps.length; i++) {
				var value1 = "";
				var value2 = "";
				var value3 = "";
				var value4 = "";
				var value5 = "";
				var value6 = "";
				var value7 = "";
				var wsId = "";
				var value8 = "";
				for (var key in json.RESULT.maps[i]) {
					if (value1 == "" && str1 == key) {
						value1 = json.RESULT.maps[i][key];
					}
					if (value2 == "" && str2 == key) {
						value2 = json.RESULT.maps[i][key];
					}
					if (value3 == "" && str3 == key) {
						value3 = json.RESULT.maps[i][key];
					}
					if (value4 == "" && str4 == key) {
						value4 = json.RESULT.maps[i][key];
					}
					if (value5 == "" && str5 == key) {
						value5 = json.RESULT.maps[i][key];
					}
					if (value7 == "" && str6 == key) {
						value7 = json.RESULT.maps[i][key];
					}
					if (value6 == "" && "OPERATION_TYPE" == key) {
						value6 = $.trim(json.RESULT.maps[i][key]);
					}
					if (wsId == "" && "WSID" == key) {
						wsId = $.trim(json.RESULT.maps[i][key]);
					}
					if (value8 == "" && str8 == key) {
						value8 = $.trim(json.RESULT.maps[i][key]);
					}
				}
				if (value6 != "") {
					btnTxt = value6;
				}
				var isCq = null;
				if (colorType) {
					isCq = maps[i].IS_CQ;
				}
				tabBody += _tabCol(isCq, maps[i].TAB_TYPE, maps[i].ID, maps[i].CUSTOMER_NAME, maps[i].CONTACTOR_MOBILE, maps[i].INTENT_LEVEL_DESC,
					maps[i].GENDER, isCheckBox, btnTxt, nextFunc1 + "('" + maps[i].ID + "','" + maps[i].TAB_TYPE + "','" + maps[i].STATUS +
					"');", nextFunc2 + "('" + maps[i].ID + "','" + maps[i].TAB_TYPE + "','" + maps[i].STATUS + "');",
					value1, value2, value3, value4, value5, value7, i + 1, maps[i].STATUS, maps[i].OPEN_ID, wsId, value8);
			}
			var totalRecords = json.RESULT.totalRecords;
			var tophtml =
				"<div style='text-align:left;width='100%';height='64px;'><font style='margin-left: 12px;'>总共</font><font id='totleNum' style='color:blue;'> " +
				totalRecords + "</font> 条记录</div>";
			var tabHtml = tophtml + tabBody;
			var tabHtml2 = tabBody;
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
				_isMoreData = false;
			}
			_isLoading = false;
		}
		onWisdomsales();
		//短信按钮模板调用加载
		$("img[name='callMsg']").click(function() {
			var phone = $(this).attr("phone");
			//短信数据加载
			var url = httpUrlHead + "PotcusAchieveService/queryMsgList.json?" + httpUrlEnd;
			makeFormCall(url, function(json) {
				if (json.RESULT.funcStatus == '1') {
					if (json.msgList != null && json.msgList.length > 0) {
						var appendHtml = '<ul class="round"><table id="tb_query">';
						for (var i = 0; i < json.msgList.length; i++) {
							appendHtml +=
								'<tr class="biaoge"><td class="msgTd" style="height: 35px;border: none;width: 100%;font-size: 16px;" id="' +
								json.msgList[i].ID + '"><li class="nob" >' + json.msgList[i].TITLE;
							appendHtml += '</li></td><td style="display:none">' + json.msgList[i].CONTENT + '</td></tr>';
						}
						appendHtml += "</table></ul>";
						layer.open({
							title: '短信模板',
							content: appendHtml,
							cancel: function() {
								sendMsg(phone, '');
							}
						});
						$(".msgTd").click(function() {
							var content = $(this).next().text();
							sendMsg(phone, content);
							layer.closeAll();
						});
					} else {
						sendMsg(phone, '');
					}
				} else {
					MuiAlert("查询失败!请联系管理员");
				}
			}, "fm");
		});

		try {
			$("#queryBtn").css("background-color", "#3377c2");
			$("#queryBtn").attr("disabled", false);
		} catch (e) {

		}
		try {
			_load_page_end(json);
		} catch (e) {

		}
	}, fm);
}

function doCallBack(fn, args) {
	return fn.apply(this, [args]);
}

function _checkBox(id) {
	var checkbox = document.getElementById(id);
	if (checkbox.checked) {
		checkbox.checked = false;
	} else {
		checkbox.checked = true;
	}
}

function _getSelectStrs() {
	var selStr = "";
	var cbArray = document.getElementsByName("userCheckBox");
	if (cbArray != null && cbArray.length > 0) {
		for (var i = 0; i < cbArray.length; i++) {
			if (cbArray[i].checked) {
				selStr += cbArray[i].value + ",";
			}
		}
	}
	if (selStr != null && selStr != "") {
		selStr = selStr.substr(0, selStr.length - 1);
	}
	return selStr;
}

function saveCallLog(tabType, id, cusPhone) {
	var isClick = $("#_plh" + tabType + "_" + id).attr("isClick");
	if (isClick == "1") {
		//已经拨号，无需二次拨号
	} else {
		var url = httpUrlHead + "PotcusAchieveService/saveCallLog.json?id=" + id + "&cusPhone=" + cusPhone + "&" + httpUrlEnd;
		makeFormCall(url, function(json) {}, "fm");
		$("#_plh" + tabType + "_" + id).attr("isClick", "1");
	}
}

function _setWeChat(openid) {
	var logonUser = JSON.parse(getLocalStorage("logonUser"));
	var salesConsultantPhone = logonUser.TEL;
	if (salesConsultantPhone == undefined || salesConsultantPhone == null || salesConsultantPhone == "") {
		MuiAlert("当前登录用户失效,请重新登录!", function() {
			ToUrl("login.html", 2);
		});
		return;
	}
	var weChatUrl = logonUser.weChatUrl;
	ToUrl(weChatUrl + "?openid=" + openid + "&mobile=" + salesConsultantPhone);
}

$(window).scroll(function() {
	if (!_isLoading && _curPage != 0) {
		var scrollTop = $(window).scrollTop();
		var windowHeight = $(window).height();
		var height = $(document).height();
		if (height - (scrollTop + windowHeight) <= 0 && _isMoreData) {
			_loadPageData("2");
		}
	}
});

function setOnWisdomsalesType() {
	$("td[wisdomsalesType='new']").attr("wisdomsalesType", 'old');
}

function onWisdomsales() {
	$("td[wisdomsalesType='new']").each(function() {
		var wsId = $(this).attr("wsId");
		var view360 = $(this).attr("view360");
		var contactorMobile = $(this).attr("phone");
		var ptId = $(this).attr("ptId");
		var tabType = $(this).attr("tabType");
		var toUrl = "wisdomSales.html?wsId=" + wsId + "&ptId=" + ptId;
		var to360Url = "view360.html?contactorMobile=" + contactorMobile;
		var left_px = -28;
		if (!IsNull(wsId) && !IsNull(view360)) {
			$(this).attr("width", "40%");
			left_px = -13;
		}
		try {
			if (!IsNull(wsId)) {
				$(this).contip({
					fade: 0,
					rise: 0,
					opacity: 0.7,
					v_size: -28,
					v_px: left_px,
					font_size: '10px', // 正文字体
					rise: 0,
					padding: 1,
					radius: 9, // 气泡圆角大小 px
					align: 'bottom',
					show: true,
					live: true,
					bg: '#1790E4',
					html: '<a href="javascript:void(0);" onclick="javascript:ToUrl(\'' + toUrl + '\');">智慧网销</a>'
				});
				left_px = left_px - 40;
			}
			if (!IsNull(view360)) {
				$(this).contip({
					fade: 0,
					rise: 0,
					opacity: 0.7,
					v_size: -28,
					v_px: left_px,
					font_size: '10px', // 正文字体
					rise: 0,
					padding: 1,
					radius: 9, // 气泡圆角大小 px
					align: 'bottom',
					show: true,
					live: true,
					bg: '#1790E4',
					html: '<a href="javascript:void(0);" style="padding:5px;" onclick="javascript:ToUrl(\'' + to360Url +
						'\');">360</a>'
				});
			}
		} catch (e) {}
	});
}

function _tabCol(colorType, tabType, id, cusName, cusPhone, intentLevel, sex, isCheckbox, btnTxt, nextFunc1, nextFunc2,
	str1, str2, str3, str4, str5, str6, num, status, openId, wsId, str8) {
	if (cusName != null && cusName != undefined && cusName.length > 6) {
		cusName = cusName.substring(0, 6);
	}
	var image = 'images/x1.png'; //默认笑脸
	if (!T_colorType) {
		image = "images/boy.png";
		if (sex == "10031002") {
			image = "images/girl.png";
		}
	}
	if (colorType == "0") {
		image = "images/x2.png"; //红
	} else if (colorType == "1") {
		image = "images/x3.png"; //淡红
	} else if (colorType == "2") {
		image = "images/x4.png"; //黄
	} else if (colorType == "3") {
		image = "images/x1.png"; //绿
	}

	var dtCss = "";
	if (btnTxt == null || btnTxt == "null" || btnTxt == "") {
		dtCss == null;
	} else if (btnTxt == true || btnTxt == "true") {
		dtCss = "weimob-list-item-icon icon-arrow-r";
		btnTxt = "";
	} else if (btnTxt == "both") {
		if (status == "30331003" || status == "30331004") { //跟进
			dtCss = "weimob-list-itemred-button";
			btnTxt = "跟进";
		} else {
			dtCss = "weimob-list-item-icon icon-arrow-r";
			btnTxt = "";
		}
	} else {
		dtCss = "weimob-list-itemred-button";
	}
	if (str1 == null || str1 == "null") {
		str1 = "&nbsp;";
	}
	if (str2 == null || str2 == "null") {
		str2 = "&nbsp;";
	}
	if (str3 == null || str3 == "null") {
		str3 = "&nbsp;";
	}
	var colBody = '';
	if (isCheckbox) {
		colBody += '<a class="weimob-list-item-all" onclick="_checkBox(\'' + tabType + '_' + id + '\')">';
	} else {
		colBody += '<a class="weimob-list-item-all">';
	}

	colBody += '<div class="weimob-list-item-title">' +
		'<table width="100%">' +
		'	<tr>';
	var numStr = "";
	if (_curPage <= 1) {
		if (num < 10) {
			numStr = "  <font style='color:blue'>0" + num + "</font>     ";
		} else {
			numStr = "  <font style='color:blue'>" + num + "</font>     ";
		}
	} else {
		var newNum = num + (_curPage - 1) * 10;
		numStr = "  <font style='color:blue'>" + newNum + "</font>     ";
	}
	if (isCheckbox) {
		colBody += '		<td align="left" width="10%">' +
			'			<input type="checkbox" onclick="_checkBox(\'' + tabType + '_' + id + '\')" value="' + tabType + '_' + id +
			'" id="' + tabType + '_' + id + '" name="userCheckBox" />' + numStr + '&nbsp;&nbsp;</a>' +
			'		</td>' +
			'		<td width="25%">' + cusName + '</td>' +
			'		<td width="25%">' + cusPhone + '</td>';
	} else {

		colBody += '		<td width="10%">' + numStr + '</td>';
		if ((wsId != null && wsId != "") || (str8 != null && str8 == "1")) {
			var contipStr = "";
			if (wsId != null && wsId != "") {
				contipStr += 'wsId="' + wsId + '"';
			}
			if (str8 != null && str8 == "1") {
				contipStr += 'view360="1"';
			}
			// 原码
			// colBody += '		<td width="25%" phone="' + cusPhone + '" name = "wisdomsalesTd" wisdomsalesType="new" ' + contipStr +
			// ' ptId="' + id + '" tabType="' + tabType + '">' + cusName + '</td>';
			// -------------------------------
			// 2019-3-22 给参数cusName 包裹了 <span class="cus-name"></span> 标签
			colBody += '		<td width="25%" phone="' + cusPhone + '" name = "wisdomsalesTd" wisdomsalesType="new" ' + contipStr +
				' ptId="' + id + '" tabType="' + tabType + '"><span class="cus-name">' + cusName + '</span></td>';
		} else {
			// 原码
			// colBody += '		<td width="25%">' + cusName + '</td>';
			// -------------------------------
			// 2019-3-22 给参数cusName 包裹了 <span class="cus-name"></span> 标签
			colBody += '		<td width="25%"><span class="cus-name">' + cusName + '</span></td>';
			// 2019-3-22 -------END
		}
		colBody += '		<td width="25%">' + cusPhone + '</td>' +
			'		<td width="20%">';
		if (cusPhone != "" && cusPhone != null && cusPhone != "未留手机号") {
			var curFileName = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
			if (curFileName == "hallReceptionManage.html") {
				//展厅
				colBody += '		<a href="javascript:;"><img ico onClick="_setCallLog(3,' + id + ',\'' + cusPhone + '\');saveCallLog(' +
					tabType + ',' + id + ',\'' + cusPhone + '\');window.location.href=\'tel:' + cusPhone +
					'\';" style="margin-left:-5px;width:25px;height:25px;" src="images/bohao.png"></a>';
			} else {
				//线索
				colBody += '		<a href="javascript:;"><img ico onClick="_setCallLog(' + tabType + ',' + id + ',\'' + cusPhone +
					'\');saveCallLog(' + tabType + ',' + id + ',\'' + cusPhone + '\');window.location.href=\'tel:' + cusPhone +
					'\';" style="margin-left:-5px;width:25px;height:25px;" src="images/bohao.png"></a>';
			}
			colBody += '		<a href="javascript:;"><img ico phone="' + cusPhone +
				'" name="callMsg" style="margin-left:5px;width:25px;height:25px;" src="images/duanxing.png"></a>';
			if (!IsNull(openId)) {
				colBody += '		<a href="javascript:;"><img ico onClick="_setWeChat(\'' + openId +
					'\');" style="margin-left:5px;width:25px;height:25px;" src="images/weChat.png"></a>';
			}
		} else {
			if (!IsNull(openId)) {
				colBody += '		<a href="javascript:;"><img ico onClick="_setWeChat(\'' + openId +
					'\');" style="margin-left:5px;width:25px;height:25px;" src="images/weChat.png"></a>';
			}
		}
		colBody += '		</td>';
	}
	colBody += '<td  align="right">' + intentLevel + '&nbsp;&nbsp;&nbsp;</td>' +
		'	</tr>' +
		'</table>' +
		'</div>' +
		'<div class="weimob-list-item-body">' +
		'	<div class="weimob-list-item-image" style="background-image:url(' + image + ')"  onclick="' + nextFunc1 +
		'"><input type="hidden" name="_page_list_hidden" id="_plh' + tabType + '_' + id + '" />' +
		'	</div>' +
		'	<div class="weimob-list-item-line" onclick="' + nextFunc1 + '">' +
		'		<div class="weimob-list-item-summary">' +
		'			<table>' +
		'				<tr>' +
		'					<td align="left" style="white-space: nowrap;">' + str1 + '</td>' +
		'					<td align="left" style="white-space: nowrap;">' + str2 + '</td>';
	if (str4 != "" && str5 != "") {
		colBody += '	<td align="left" style="white-space: nowrap;">' + str3 + '</td>' +
			'				</tr>' +
			'			</table>' +
			'		</div>';
		if (str6 != "" && str6 != null) {
			colBody += '		<div class="weimob-list-item-summary" style=" margin-top:-2px;">';
		} else {
			colBody += '		<div class="weimob-list-item-summary">';
		}
		colBody += '			<table>' +
			'				<tr>' +
			'					<td align="left" style="white-space: nowrap;" width="30%">' + str4 + '</td>' +
			'					<td align="left" style="white-space: nowrap;" width="70%">' + str5 + '</td>' +
			'				</tr>' +
			'			</table>' +
			'		</div>';
	} else if (str4 != "") {
		colBody += '</tr>' +
			'			</table>' +
			'		</div>';
		if (str6 != "" && str6 != null) {
			colBody += '		<div class="weimob-list-item-summary" style=" margin-top:-2px;">';
		} else {
			colBody += '		<div class="weimob-list-item-summary">';
		}
		colBody += '			<table style="table-layout:fixed;">' +
			'				<tr>' +
			'					<td align="left" width="40%" style="white-space: nowrap;overflow:hidden;">' + str3 + '</td>' +
			'					<td align="left" width="60%" style="white-space: nowrap;text-indent:8px;">' + str4 + '</td>' +
			'				</tr>' +
			'			</table>' +
			'		</div>';
	} else {
		colBody += '</tr>' +
			'			</table>' +
			'		</div>';
		if (str6 != "" && str6 != null) {
			colBody += '		<div class="weimob-list-item-summary" style=" margin-top:-2px;">';
		} else {
			colBody += '		<div class="weimob-list-item-summary">';
		}
		colBody += '			<table>' +
			'				<tr>' +
			'					<td align="left" style="white-space: nowrap;">' + str3 + '</td>' +
			'				</tr>' +
			'			</table>' +
			'		</div>';
	}
	if (str6 != "" && str6 != null) {
		colBody +=
			'		<div class="weimob-list-item-summary" style=" margin-top:-2px;">' +
			'			<table>' +
			'				<tr>' +
			'					<td align="left" style="white-space: nowrap;">' + str6 + '</td>' +
			'				</tr>' +
			'			</table>' +
			'		</div>';
	}
	colBody += '	</div>';
	if (dtCss != null && dtCss != "") {
		colBody += '<div class="weimob-list-item-button" onclick="' + nextFunc2 + '">' +
			'<div class="' + dtCss + '">' + btnTxt + '</div>' +
			'</div>' +
			'</div>';

	}
	colBody += '</a>';
	return colBody;
}
var tabhtml1 = '<div class="weimob-content">' +
	' 				<div class="weimob-list">';
var tabhtml2 = '	</div>' +
	'			</div>';
