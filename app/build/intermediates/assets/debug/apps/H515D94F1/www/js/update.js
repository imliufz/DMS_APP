/**
 * 参考文档：http://ask.dcloud.net.cn/article/431
 * 升级文件为JSON格式数据，如下：
 * 
 * 需升级
 {
	"status":1,
	"version": "2.6.0",
	"title": "Hello MUI版本更新",
	"note": "修复“选项卡+下拉刷新”示例中，某个选项卡滚动到底时，会触发所有选项卡上拉加载事件的bug；\n修复Android4.4.4版本部分手机上，软键盘弹出时影响图片轮播组件，导致自动轮播停止的bug；",
	"url": "http://www.dcloud.io/hellomui/HelloMUI.apk"
}
*
* 无需升级
{"status":0}
 */
var server = httpUrlHead+"AppService/validateVersion.json?rpcFlag=2"; //获取升级描述文件服务器地址
//var server = httpUrlHead+"AppService/validateVersionTest.json?rpcFlag=2"; //获取升级描述文件服务器地址 for 试点

function update() {
	makeFormCall(server,function(data){
		if(parseFloat(plus.runtime.version) < parseFloat(data.shellUpdate.ver)) {
			if(data.shellUpdate.type == "1"){
				//选择更新
				plus.nativeUI.confirm(data.shellUpdate.remark+"", function(event) {
					if (0 == event.index) {
						plus.runtime.openURL(data.shellUpdate.address);
					}
				}, "发现新版本", ["立即更新", "取　　消"]);
			} else {
				//强制更新
				try{
					document.getElementById("loginSubmit").disabled = true;
					document.getElementById("loginSubmit").style.backgroundColor = "gray"
				}catch(e){
					
				}
				plus.nativeUI.confirm(data.shellUpdate.remark+"", function(event) {
					if (0 == event.index) {
						plus.runtime.openURL(data.shellUpdate.address);
					} else {
						plus.runtime.quit();
					}
				}, "发现新版本", ["立即更新"]);
			}
		}
	},null,true);
}

mui.os.plus && !mui.os.stream && mui.plusReady(update);