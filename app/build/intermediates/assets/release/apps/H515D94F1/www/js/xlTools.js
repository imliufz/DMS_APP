/**
 * @author imliufazhong
 * @param name 键
 * @param value 值
 */

//写入cookie
function SetCookie(name, value) {
	var Days = 30; // 此 cookie 将被保存 30 天
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires="
			+ exp.toGMTString();
}

// /删除cookie
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

// 读取cookie
function getCookie(name) {
	var arr = document.cookie
			.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null)
		return unescape(arr[2]);
	return null;
}

//html5本地存储 localStorage
//写入存储
function setLocalStorage(key,value){
	localStorage.setItem(key,value);
}

//读取存储
function getLocalStorage(key){
	return localStorage.getItem(key);
}

//移除存储
function removeLocalStorage(key){
	try {localStorage.removeItem(key);} catch (e) {}
}

//html5Session存储
//写入session
function setSessionStorage(key,value){
	sessionStorage.setItem(key,value);
}

//读取存储
function getSessionStorage(key){
	return sessionStorage.getItem(key);
}

//删除存储
function removeSessionStorage(key){
	try {sessionStorage.removeItem(key);} catch (e) {}
}

//HTML 跳转获取参数
UrlParm = function() { // url参数    
	  var data, index;    
	  (function init() {    
	    data = [];    
	    index = {};    
	    var u = window.location.search.substr(1);    
	    if (u != '') {    
	      var parms = decodeURIComponent(u).split('&');    
	      for (var i = 0, len = parms.length; i < len; i++) {    
	        if (parms[i] != '') {    
	          var p = parms[i].split("=");    
	          if (p.length == 1 || (p.length == 2 && p[1] == '')) {// p | p=    
	            data.push(['']);    
	            index[p[0]] = data.length - 1;    
	          } else if (typeof(p[0]) == 'undefined' || p[0] == '') { // =c | =    
	            data[0] = [p[1]];    
	          } else if (typeof(index[p[0]]) == 'undefined') { // c=aaa    
	            data.push([p[1]]);    
	            index[p[0]] = data.length - 1;    
	          } else {// c=aaa    
	            data[index[p[0]]].push(p[1]);    
	          }    
	        }    
	      }    
	    }    
	  })();    
	  return {    
	    // 获得参数,类似request.getParameter()    
	    parm : function(o) { // o: 参数名或者参数次序    
	      try {    
	        var returnParm = encodeURI((typeof(o) == 'number' ? data[o][0] : data[index[o]][0]));
            returnParm = decodeURI(returnParm);
	        return returnParm;  
	      } catch (e) {    
	      }    
	    },    
	    //获得参数组, 类似request.getParameterValues()    
	    parmValues : function(o) { //  o: 参数名或者参数次序    
	      try {    
	        return (typeof(o) == 'number' ? data[o] : data[index[o]]);    
	      } catch (e) {}    
	    },    
	    //是否含有parmName参数    
	    hasParm : function(parmName) {    
	      return typeof(parmName) == 'string' ? typeof(index[parmName]) != 'undefined' : false;    
	    },    
	    // 获得参数Map ,类似request.getParameterMap()    
	    parmMap : function() {    
	      var map = {};    
	      try {    
	        for (var p in index) {  map[p] = data[index[p]];  }    
	      } catch (e) {}    
	      return map;    
	    }    
	  };    
}();

function JSParm(jsId,o){
	var data = [];    
    var index = {};
    var u = document.getElementById(jsId);
    if(u != undefined && u != null){  
	  var parms = u.getAttribute("src").substring(u.getAttribute("src").lastIndexOf("?")+1).split("&");
      for (var i = 0, len = parms.length; i < len; i++) {    
        if (parms[i] != '') {    
          var p = parms[i].split("=");    
          if (p.length == 1 || (p.length == 2 && p[1] == '')) {// p | p=    
            data.push(['']);    
            index[p[0]] = data.length - 1;    
          } else if (typeof(p[0]) == 'undefined' || p[0] == '') { // =c | =    
            data[0] = [p[1]];    
          } else if (typeof(index[p[0]]) == 'undefined') { // c=aaa    
            data.push([p[1]]);    
            index[p[0]] = data.length - 1;    
          } else {// c=aaa    
            data[index[p[0]]].push(p[1]);    
          }    
        }    
      }    
    }
    try {    
	    	return (typeof(o) == 'number' ? data[o][0] : data[index[o]][0]);    
	    } catch (e) {    
	}  
}
//计算日期差
function _GetDateDiff(startTime, endTime, diffType) {
	//将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
	startTime = startTime.replace(/\-/g, "/");
	endTime = endTime.replace(/\-/g, "/");
	//将计算间隔类性字符转换为小写
	diffType = diffType.toLowerCase();
	var sTime = new Date(startTime); //开始时间
	var eTime = new Date(endTime); //结束时间
	//作为除数的数字
	var divNum = 1;
	switch (diffType) {
	case "second":
		divNum = 1000;
		break;
	case "minute":
		divNum = 1000 * 60;
		break;
	case "hour":
		divNum = 1000 * 3600;
		break;
	case "day":
		divNum = 1000 * 3600 * 24;
		break;
	default:
		break;

	}
	return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
}

/**
 * 时间类型转换为字符串
 * @param {Object} date 需要转换的时间，不传默认当前时间
 * @param {Object} dateType 时间类型[1 yyyy-MM-dd/2 yyyy-MM-dd HH:mm 其它  yyyy-MM-dd HH:mm:ss]
 */
function _getNowFormatDate(date,dateType) {
	if(date == null || date == undefined) {
		date = new Date();		
	}
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHours = date.getHours();
    var strMinutes = date.getMinutes();
    var strSeconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHours >= 0 && strHours <= 9) {
    	strHours = "0" + strHours;
    }
    if (strMinutes >= 0 && strMinutes <= 9) {
    	strMinutes = "0" + strMinutes;
    }
    if (strSeconds >= 0 && strSeconds <= 9) {
    	strSeconds = "0" + strSeconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + strHours + seperator2 + strMinutes
            + seperator2 + strSeconds;
    if(dateType == "1"){
    	currentdate = currentdate.substr(0,10);
    } else if(dateType == "2"){
    	currentdate = currentdate.substr(0,16);
    }
    return currentdate;
}

//日期加减值
function _addDate(curDate,nDays){
	if(curDate == null || curDate == undefined) {
		curDate = new Date();		
	}
	var a = new Date(curDate);
	a = a.valueOf();
	a = a + nDays * 24 * 60 * 60 * 1000;
	a = new Date(a);
	return a;
}

// 去掉字符串左右空格
function strTrim(str)   
{   
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.trim=function(){ 
	return this.replace(/(^\s*)|(\s*$)/g, ""); 
};

String.prototype.ltrim=function(){ 
	return this.replace(/(^\s*)/g,""); 
};

String.prototype.rtrim=function(){ 
	return this.replace(/(\s*$)/g,""); 
};

/**
 * 判断是ANDROID还是其它，ANDROID返回true
 */
function _isAndroid(){
	var u = navigator.userAgent;
	return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
}

/**
 * 验证空
 * 返回 true 为空 false 不为空
 * @param {Object} obj 验证空对象
 */
function IsNull(obj){
	try{
		if(obj == undefined || obj == null || obj == "" || obj == "undefined" || obj == "NULL" || obj == "null"){
			return true;
		} else {
			return false;
		}
	}catch(e){
		return true;
	}
}

/**
 * 验证值是否为空 true为空 false非空
 * @param {Object} objId 控件ID
 */
function valueIsNull(objId){
	try{
		var val = document.getElementById(objId).value;
		if(IsNull(val)){
			return true;
		} else {
			return false;
		}
	}catch(e){
		return true;
	}
}

/**
 * 文本框根据输入内容自适应高度
 * @author               liu fa zhong
 * @version              1.0
 * @see                  http://www.planeart.cn/?p=1489
 * @param                {HTMLElement}           输入框元素
 * @param                {String}                输入框元素
 * @param                {Number}                设置光标与输入框保持的距离(默认20)
 * @param                {Number}                设置最大高度(可选)
 */
var autoTextarea = function (elem, defaultValue, extra, maxHeight) {
        extra = extra || 20;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
        isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                addEvent = function (type, callback) {
                        elem.addEventListener ?
                                elem.addEventListener(type, callback, false) :
                                elem.attachEvent('on' + type, callback);
                },
                getStyle = elem.currentStyle ? function (name) {
                        var val = elem.currentStyle[name];
                        
                        if (name === 'height' && val.search(/px/i) !== 1) {
                                var rect = elem.getBoundingClientRect();
                                return rect.bottom - rect.top -
                                        parseFloat(getStyle('paddingTop')) -
                                        parseFloat(getStyle('paddingBottom')) + 'px';        
                        };
                        
                        return val;
                } : function (name) {
                                return getComputedStyle(elem, null)[name];
                },
                minHeight = parseFloat(getStyle('height'));
        
        
        elem.style.resize = 'none';
        
        var change = function () {
                var scrollTop, height,
                        padding = 0,
                        style = elem.style;
                
                if (elem._length === elem.value.length) return;
                elem._length = elem.value.length;
                
                if (!isFirefox && !isOpera) {
                        padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                };
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                
                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                        if (maxHeight && elem.scrollHeight > maxHeight) {
                                height = maxHeight - padding;
                                style.overflowY = 'auto';
                        } else {
                                height = elem.scrollHeight - padding;
                                style.overflowY = 'hidden';
                        };
                        style.height = height + extra + 'px';
                        scrollTop += parseInt(style.height) - elem.currHeight;
                        document.body.scrollTop = scrollTop;
                        document.documentElement.scrollTop = scrollTop;
                        elem.currHeight = parseInt(style.height);
                };
        };
        
		$(elem).bind("change",function(){
			change();
		});
        addEvent('propertychange', change);
        addEvent('input', change);
        addEvent('focus', change);
        change();
        
        //增加焦点事件
        if(defaultValue != undefined && defaultValue != null && defaultValue != "") {
        	elem.value = defaultValue;
        	elem.style.color = "gray";
        	elem.onfocus = function() {
        		elem.style.color = "black";
				if(elem.value === defaultValue) {
					elem.value = '';
				}
			};
			elem.onblur = function() {
				if(elem.value === '') {
					elem.style.color = "gray";
					elem.value = defaultValue;
				}
			};
        }
};

/**
 * 加密
 * @param inStr
 * @return
 */
function enCode(inStr){
	var s = "";
	for(var i = 0;i < inStr.length;i++){
		s += getRandomString(i+1);
		s += inStr.charAt(i);
	}
	return s;
}

/**
 * 解密
 * @param inStr
 * @return
 */
function deCode(inStr){
	try {
		var s = "";
		var lastIndex = 0;
		for(var i = 0;i < inStr.length;i++){
			lastIndex += i+1;
			s += inStr.substring(lastIndex, lastIndex+1);
			if (lastIndex+2 >= inStr.length) {
				break;
			}
			lastIndex = lastIndex+1;
		}
		return s;
	} catch (e) {
		return inStr;
	}
}

function getRandomString(len) {　　
	len = len || 32;　　
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
	var maxPos = $chars.length;　　
	var pwd = '';　　
	for(i = 0; i < len; i++) {　　　　
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
	}　　
	return pwd;
}