package com.yy.activity;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.Window;
import android.webkit.WebView;
import android.widget.FrameLayout;

import com.yy.utils.StringUtils;

import java.util.UUID;

import io.dcloud.EntryProxy;
import io.dcloud.common.DHInterface.ISysEventListener.SysEventType;
import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.IWebviewStateListener;
import io.dcloud.feature.internal.sdk.SDK;

/**
 * Created by ERIC on 2019-12-06.
 */

public class SDKWebViewActivity extends Activity{
    boolean doHardAcc = true;
    IWebview webview = null;

    EntryProxy mEntryProxy = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        //直接获取存在的低层EntryProxy
        mEntryProxy = EntryProxy.getInstnace();
        mEntryProxy.onCreate(this, savedInstanceState,
                SDK.IntegratedMode.WEBVIEW, null);

        final FrameLayout rootView = new FrameLayout(this);
        setContentView(rootView);

        rootView.setBackgroundColor(0xffffffff);
        rootView.getViewTreeObserver().addOnGlobalLayoutListener(
                new ViewTreeObserver.OnGlobalLayoutListener() {
                    @Override
                    public void onGlobalLayout() {
                        webview.onRootViewGlobalLayout(rootView);
                    }
                });


        Bundle bd = this.getIntent().getExtras();
        String url =  StringUtils.paramsToUrl(bd.getString("params"));
        String appid = UUID.randomUUID().toString();
        // 单页面集成时要加载页面的路径，可以是本地文件路径也可以是网络路径
        String localUrl = "file:///android_asset/apps/H515D94F1/www/";
        String viewUrl = "";

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            viewUrl = localUrl + url;
        } else {
            viewUrl = url;
        }
        webview = SDK.createWebview(this, viewUrl, appid,
                new IWebviewStateListener() {
                    @Override
                    public Object onCallBack(int pType, Object pArgs) {
                        switch (pType) {
                            case IWebviewStateListener.ON_WEBVIEW_READY:
                                // 准备完毕之后添加webview到显示父View中，设置排版不显示状态，避免显示webview时，html内容排版错乱问题
                                ((IWebview) pArgs).obtainFrameView()
                                        .obtainMainView()
                                        .setVisibility(View.INVISIBLE);
                                SDK.attach(rootView, ((IWebview) pArgs));
                                break;
                            case IWebviewStateListener.ON_PAGE_STARTED:
                                // 首页面开始加载事件
                                break;
                            case IWebviewStateListener.ON_PROGRESS_CHANGED:
                                // 首页面加载进度变化
                                break;
                            case IWebviewStateListener.ON_PAGE_FINISHED:
                                // 页面加载完毕，设置显示webview
                                webview.obtainFrameView().obtainMainView()
                                        .setVisibility(View.VISIBLE);
                                break;
                        }
                        return null;
                    }
                });

        final WebView webviewInstance = webview.obtainWebview();
        // 添加自定义JS交互对象
        /*webviewInstance.addJavascriptInterface(new EcmsPlusImpl(this),
                "EcmsPlus");*/
        // 监听返回键
        webviewInstance.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (keyCode == KeyEvent.KEYCODE_BACK) {
                    if (webviewInstance.canGoBack()) {
                        webviewInstance.goBack();
                        return true;
                    } else {
                        SDKWebViewActivity.this.finish();
                    }
                }
                return false;
            }
        });

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        return mEntryProxy.onActivityExecute(this,
                SysEventType.onCreateOptionMenu, menu);
    }

    @Override
    public void onPause() {
        super.onPause();
        mEntryProxy.onPause(this);
    }

    @Override
    public void onResume() {
        super.onResume();
        mEntryProxy.onResume(this);
    }

    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (intent.getFlags() != 0x10600000) {// 非点击icon调用activity时才调用newintent事件
            mEntryProxy.onNewIntent(this, intent);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mEntryProxy.destroy(this);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        boolean _ret = mEntryProxy.onActivityExecute(this,
                SysEventType.onKeyDown, new Object[] { keyCode, event });
        return _ret ? _ret : super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        boolean _ret = mEntryProxy.onActivityExecute(this,
                SysEventType.onKeyUp, new Object[] { keyCode, event });
        return _ret ? _ret : super.onKeyUp(keyCode, event);
    }

    @Override
    public boolean onKeyLongPress(int keyCode, KeyEvent event) {
        boolean _ret = mEntryProxy.onActivityExecute(this,
                SysEventType.onKeyLongPress, new Object[] { keyCode, event });
        return _ret ? _ret : super.onKeyLongPress(keyCode, event);
    }

    public void onConfigurationChanged(Configuration newConfig) {
        try {
            int temp = this.getResources().getConfiguration().orientation;
            if (mEntryProxy != null) {
                mEntryProxy.onConfigurationChanged(this, temp);
            }
            super.onConfigurationChanged(newConfig);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        mEntryProxy.onActivityExecute(this, SysEventType.onActivityResult,
                new Object[] { requestCode, resultCode, data });
    }

}
