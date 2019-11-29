package com.yy.app;

import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory;

/**
 * Created by ERIC on 2019-11-27.
 */

public class ProtogenDataUtil {
    public static String getAliDeviceId(){
        return PushServiceFactory.getCloudPushService().getDeviceId();
    }
}
