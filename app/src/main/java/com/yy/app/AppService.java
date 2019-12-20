package com.yy.app;

//import android.app.NotificationManager;
//import android.app.PendingIntent;
//import android.content.Context;
//import android.content.Intent;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.yy.utils.LogUtils;
import com.yy.utils.PmTool;
import com.yy.utils.StringUtils;

import java.util.ArrayList;

import io.dcloud.PandoraEntry;
import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.feature.internal.sdk.SDK;

//import android.support.v4.app.NotificationCompat;
//import com.yy.jc.R;

/**
 * Created by ERIC on 2018-08-27.
 */

public class AppService extends PandoraEntry {

    public AppService() {

    }

    protected void onCreate(Bundle var1) {
        super.onCreate(var1);

        //取消使用极光推送2019年11月26日16:57:02----start
        /*JPushInterface.setDebugMode(false);//测试版为true
        JPushInterface.init(this.getApplicationContext());
        String registrationId = JPushInterface.getRegistrationID(this.getApplicationContext());
        Log.e("1099", "run:--------->registrationId： "+registrationId );*/
        //取消使用极光推送2019年11月26日16:57:02----end

        //加载权限
        PmTool.permissionAll(this);
        //推送消息定位打开页面
        pushOpen();
    }

    /**
     * 推送消息页面定位
     */
    private void pushOpen() {
        try {
            //打开指定Activity时，在该Activity的onCreate()中调用如下代码获取指定参数
            Intent intent = getIntent();
            // 通知标题
            String title = intent.getStringExtra("title");
            // 通知内容
            String summary = intent.getStringExtra("summary");
            // 通知额外参数
            String extraMap = intent.getStringExtra("extraMap");
            LogUtils.i(title+"-"+summary+"-"+extraMap);
            if(extraMap != null && extraMap != "" && extraMap.contains("url")){
                //如果需要定位到指定页面，则json字符串中必须带有"url"的key
                String url = StringUtils.paramsToUrl(extraMap);
                ArrayList<IWebview> weblist = SDK.obtainAllIWebview();
                //遍历所有的webview然后进行获取对应的名字
                for (int i = 0; i < weblist.size(); i++) {
                    if (weblist.get(i).getOriginalUrl().contains("index.html")) {
                        Log.d("autoDebug", (weblist.get(i)).toString());
                        //使用evalJS进行调用
                        weblist.get(i).evalJS("javascript:openUrl('"+url+"')");
                        break;
                    }
                }
            }
        }catch (Exception e){
            LogUtils.i(e.getMessage());
        }
    }
}
