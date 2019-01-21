package com.yy.app;

import android.app.Application;

import io.dcloud.application.DCloudApplication;

import com.growingio.android.sdk.collection.Configuration;
import com.growingio.android.sdk.collection.GrowingIO;
/**
 * Created by ERIC on 2019-01-07.
 */

public class DmsApplication extends DCloudApplication {
    public void onCreate() {
        super.onCreate();

        GrowingIO.startWithConfiguration(this, new Configuration()
                .trackAllFragments()
                .setChannel("营销宝二维码")
        );
    }
}
