/**
 * Mui弹框提示
 * @param {Object} message 提示消息
 * @param {Object} callBackFunc 回调方法
 */
function MuiAlert(message,callBackFunc){
	mui.alert(message,"提示","确定",callBackFunc,"div");
}

/**
 * Mui确认框
 * @param {Object} message 提示消息
 * @param {Object} callBackFunc 回调函数
 * @param {Object} title 标题
 * @param {Object} btnType 按钮类型1[是/否]2[确定/取消]
 */
function MuiConfirm(message,callBackFunc,title,btnType){
	var btnArray = null;
	if(title == undefined || title == null || title == ""){
		title = "提示";
	}
	if(btnType == "1") {
		btnArray = ['是','否'];
	} else if(btnType == undefined || btnType == null || btnType == "" || btnType == "2") {
		btnArray = ['确定','取消'];
	} else {
		btnArray = btnType;
	}
	mui.confirm(message,title,btnArray,callBackFunc,"div");
}

/**
 * Mui提示输入框
 * @param {Object} message 消息
 * @param {Object} callBackFunc 回调方法
 * @param {Object} title 头
 * @param {Object} btnType 按钮类型
 */
function MuiPrompt(message,callBackFunc,title,btnType){
	var btnArray = null;
	if(title == undefined || title == null || title == ""){
		title = "提示";
	}
	if(btnType == "1") {
		btnArray = ['是','否'];
	} else if(btnType == undefined || btnType == null || btnType == "" || btnType == "2") {
		btnArray = ['确定','取消'];
	} else {
		btnArray = btnType;
	}
	mui.prompt(message, '', title, btnArray, callBackFunc,"div");
}

/**
 * Mui消息框（自动关闭）
 * @param {Object} message 消息内容
 */
function MuiMessage(message){
	mui.toast(message);
}

/**
 * 打开新页面
 * @param {Object} toUrl 地址
 * @param {Object} animationTypeShow [1右侧打开(默认)/2左侧打开]
 */
var _open_url_count = 0;
function ToUrl(toUrl,animationTypeShow){
	if(_open_url_count == 1){
		return;
	}
	_open_url_count = 1;
	setTimeout(function(){
		_open_url_count = 0;
	},2000);
	toUrl = encodeURI(toUrl);
	if(animationTypeShow == undefined || animationTypeShow == null || animationTypeShow == "" || animationTypeShow == "1"){
		animationTypeShow = "slide-in-right";
	} else {
		animationTypeShow = "slide-in-left";
	}
	try{
		var webvw = plus.webview.getWebviewById(toUrl.split(".")[0]);
		if(webvw != null){
			webvw.close("none",0);
		}
	}catch(e){
	}
	mui.openWindow({
		url: toUrl,
		id: toUrl.split(".")[0],
		show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true  
					aniShow: animationTypeShow, //页面显示动画，默认为”slide-in-right“；  
					duration: "200" //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；  
		},
		createNew:true,
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
	
}

/**
 * 调用系统加载中
 * @param {Object} msg 提示消息：默认[加载中...]
 */
function MuiLoading(msg){
	if(msg == undefined || msg == null || msg == ""){
		msg = "加载中...";
	}
	return plus.nativeUI.showWaiting(msg);
}

/**
 * 调用系统通讯录
 */
function GetContact(callBackFunc){
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	if(isAndroid){//安卓
		var REQUESTCODE = 1000;
		main = plus.android.runtimeMainActivity();
		var Intent = plus.android.importClass('android.content.Intent');
		var ContactsContract = plus.android.importClass('android.provider.ContactsContract');
		var intent = new Intent(Intent.ACTION_PICK, ContactsContract.Contacts.CONTENT_URI);
		main.onActivityResult = function(requestCode, resultCode, data) {
			if(REQUESTCODE == requestCode) {
				var phoneNumber = null;
				var resultString = "";
				var context = main;
				plus.android.importClass(data);
				var contactData = data.getData();
				var resolver = context.getContentResolver();
				plus.android.importClass(resolver);
				var cursor = resolver.query(contactData, null, null, null, null);
				plus.android.importClass(cursor);
				cursor.moveToFirst();
				var givenName = cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME));
				var contactId = cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts._ID));
				var pCursor = resolver.query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
					null, ContactsContract.CommonDataKinds.Phone.CONTACT_ID + " = " + contactId,
					null, null);
				while(pCursor.moveToNext()) {
					phoneNumber = pCursor.getString(pCursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
				}
				cursor.close();
				pCursor.close();
				try{
					callBackFunc(givenName,phoneNumber);
				}catch(e){
					console.log(e);
				}
			}
		};
		main.startActivityForResult(intent, REQUESTCODE);
	} else{//ios
		// 自定义通讯录类
   		var DMSPeoplePickerNavigationController = plus.ios.importClass("DMSPeoplePickerNavigationController");
    	// 创建对象的实例
    	var peoplePicker = new DMSPeoplePickerNavigationController();
    	peoplePicker.showAddressBook();
	}
}

//通话状态Android
var Native = (function($) {
	var native = {};
	var receiver, main, context, TelephonyManager;

	native.listenTelPhone = function(callback) {

			$.plusReady(function() {
				context = plus.android.importClass('android.content.Context'); //上下文
				TelephonyManager = plus.android.importClass('android.telephony.TelephonyManager'); //通话管理
				main = plus.android.runtimeMainActivity(); //获取activity
				receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
					onReceive: doReceive //实现onReceiver回调函数
				});
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				var Intent = plus.android.importClass('android.content.Intent');
				var filter = new IntentFilter();

				filter.addAction(TelephonyManager.ACTION_PHONE_STATE_CHANGED); //监听电话状态
				main.registerReceiver(receiver, filter); //注册监听
			});

			function doReceive(context, intent) {
				plus.android.importClass(intent);

				var phoneNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER),
					telephony = context.getSystemService(context.TELEPHONY_SERVICE),
					state = telephony.getCallState();
				switch(state) {
					case TelephonyManager.CALL_STATE_RINGING:
						callback && callback(1, phoneNumber);
						//console.log("[Broadcast]等待接电话=" + phoneNumber);
						break;
					case TelephonyManager.CALL_STATE_IDLE:
						callback && callback(0, phoneNumber);
						//console.log("[Broadcast]电话挂断=" + phoneNumber);
						break;
					case TelephonyManager.CALL_STATE_OFFHOOK:
						callback && callback(2, phoneNumber);
						//console.log("[Broadcast]通话中=" + phoneNumber);
						break;
				}
			}
		},
		native.removeListenTelPhone = function() {
			if(receiver) {
				main = plus.android.runtimeMainActivity(); //获取activity
				main.unregisterReceiver(receiver); //删除监听
				receiver = null;
			}
		}

	return native;
}(mui));

function _setCallLog(tabType,id,cusPhone){
	if(mui.os.plus && !mui.os.stream){
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		if( isAndroid ){//安卓
			//设置当前正在拨号的潜客
			var obj = {};
			obj.tabType=tabType;
			obj.id = id;
			obj.startTime = _getNowFormatDate();
			setLocalStorage("CALL_LOG|"+cusPhone,JSON.stringify(obj));
		} else {//ios
			
		}
	}
}

//获取通话记录
function _getCallLog(){
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	if( isAndroid ){//安卓
		mui.plusReady(function() {
			try {
				Native.listenTelPhone(function(code,number) {
					if(code == 0){
						//通话结束
						var callLog = getLocalStorage("CALL_LOG|"+number);
						if(!IsNull(callLog)){
							var obj = eval("("+callLog+")");
							obj.endTime = _getNowFormatDate();
							setLocalStorage("CALL_LOG|"+number,JSON.stringify(obj));
						}
					} else if(code == 1){
						//等待接电话
					} else if(code == 2){
						//通话中
						var callLog = getLocalStorage("CALL_LOG|"+number);
						if(!IsNull(callLog)){
							var obj = eval("("+callLog+")");
							obj.startTime = _getNowFormatDate();
							setLocalStorage("CALL_LOG|"+number,JSON.stringify(obj));
						}
					}
				});
			} catch(e) {
				console.log(e);
			}
		})
		
		//立即执行一次上传
		_saveCallLogTimes();
		//启动定时任务将已完成的通话记录上传(5分钟上传1次)
		setInterval(function(){
			_saveCallLogTimes();
		},300000);
	} else{//ios
		
	}
	
}

//上传通话记录
function _saveCallLogTimes(){
	//遍历集合
	for(var i=0; i<localStorage.length;i++){
		var key = localStorage.key(i);
		try{
			if("CALL_LOG" == key.split("|")[0]){
				//为拨号记录
				var obj = eval("("+getLocalStorage(localStorage.key(i))+")");
				//判断是否已经通话结束
				if (!IsNull(obj.tabType) && !IsNull(obj.id) && !IsNull(obj.startTime) && !IsNull(obj.endTime)
					&& _GetDateDiff(obj.startTime,obj.endTime,"second") > 0) {
					//ajax上传通话记录
					//TODO
					//使用独立ajax上传
					if(setFormCount == 0){
						setForm("fm");
					}
					var formParam = $("#fm").serialize();//序列化表格内容为字符串    
					$.ajax({
						type:'post',        
				        url:httpUrlHead+"PotcusAchieveService/saveCallTimeLog.json?id="+obj.id+"&tabType="+obj.tabType+"&callNo="+key.split("|")[1]+"&startTime="+obj.startTime+"&endTime="+obj.endTime+"&"+httpUrlEnd,    
				        data:formParam,    
				        cache:false,
				        dataType:"json",
				        success:function(data){
				        	try {
				        		if (data.RESULT.funcStatus == 1) {
				            		//成功时调用
				            		//上传完成删除本地存储通话记录
									removeLocalStorage("CALL_LOG|"+data.callNo);
				    			}
				        	}catch(e){
				        		
				        	}
				        },
				        error:function(data){
				        	try{
				        		if (data.RESULT.funcStatus == 1) {
				            		//成功时调用
				            		//上传完成删除本地存储通话记录
									removeLocalStorage("CALL_LOG|"+data.callNo);
				    			}
				        	}catch(e){
				        		
				        	}
				        }
					});
				} else {
					//记录有效性验证
					if(IsNull(obj.id) || IsNull(obj.tabType) || IsNull(obj.startTime)
						|| (IsNull(obj.endTime) && _GetDateDiff(obj.startTime,_getNowFormatDate(),"hour") > 24)
						|| (!IsNull(obj.endTime) && _GetDateDiff(obj.startTime,obj.endTime,"second") <= 0)){
						//删除不合要求通话记录
						removeLocalStorage(localStorage.key(i));
					}
				}
			}
		}catch(e){
		}
	}
}
