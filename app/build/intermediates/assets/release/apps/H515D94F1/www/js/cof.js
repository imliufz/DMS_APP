var focusTime = 20;
mui.os.plus && !mui.os.stream && mui.plusReady(setFocus);
//设置程序调用焦点
function setFocus(){
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	if( isAndroid ){
	} else{//ios
		focusTime = 400;
		// 自定义通讯录类
   		var DMSPeoplePickerNavigationController = plus.ios.importClass("DMSPeoplePickerNavigationController");
    		// 创建对象的实例
    		var peoplePicker = new DMSPeoplePickerNavigationController();
    		peoplePicker.setFocus();
	}
}