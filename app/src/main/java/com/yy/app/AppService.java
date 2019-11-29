package com.yy.app;

//import android.app.NotificationManager;
//import android.app.PendingIntent;
//import android.content.Context;
//import android.content.Intent;

import android.os.Bundle;

import com.yy.utils.PmTool;

import io.dcloud.PandoraEntry;

//import android.support.v4.app.NotificationCompat;
//import com.yy.jc.R;

/**
 * Created by ERIC on 2018-08-27.
 */

public class AppService extends PandoraEntry {
    public AppService(){

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
        //PmTool.permission(this,);
        /*Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(
                        AppService.this).setSmallIcon(R.drawable.icon)
                        .setContentTitle("5 new message")
                        .setContentText("twain@android.com");
                mBuilder.setTicker("New message");//第一次提示消息的时候显示在通知栏上
                mBuilder.setNumber(12);
                //mBuilder.setLargeIcon(R.drawable.icon);
                mBuilder.setAutoCancel(true);//自己维护通知的消失

                //构建一个Intent
                Intent resultIntent = new Intent(AppService.this,
                        AppService.class);
                //封装一个Intent
                PendingIntent resultPendingIntent = PendingIntent.getActivity(
                        AppService.this, 0, resultIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT);
                // 设置通知主题的意图
                mBuilder.setContentIntent(resultPendingIntent);
                //获取通知管理器对象
                NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                mNotificationManager.notify(0, mBuilder.build());
            }
        });
        thread.start();*/
    }
}
