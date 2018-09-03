package com.yy.app;

import android.app.Activity;
import android.util.Log;

import cn.jpush.android.api.JPushInterface;

/**
 * Created by ERIC on 2018-08-28.
 */

public class JpushService extends Activity{
    public void setRegistrationID(){
        JPushInterface.setDebugMode(false);//测试版为true
        JPushInterface.init(this);
        String registrationId = JPushInterface.getRegistrationID(this);
        Log.e("1099", "run:--------->registrationId： "+registrationId );
    }
}
