package com.yy.utils;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PermissionGroupInfo;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;

import com.blankj.utilcode.util.ObjectUtils;
import com.blankj.utilcode.util.PermissionUtils;
import com.blankj.utilcode.util.Utils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ERIC on 2019-11-29.
 */

public class PmTool {
    interface CallBack{
        void success();
        void failure();
    }

    /**
     * 初始化工具类
     * @param context
     */
    public static void initUtils(Context context){
        Utils.init(context.getApplicationContext());
    }

    /**
     * 想要申请的权限
     * @param permissions
     */
    public static void permission(String[] permissions, final CallBack callBack){
        PermissionUtils.permission(permissions).callback(new PermissionUtils.SimpleCallback() {
            /**
             * 权限请求成功
             */
            @Override
            public void onGranted() {
                if (ObjectUtils.isNotEmpty(callBack)) callBack.success();
                LogUtils.i("权限请求成功！");
            }

            /**
             * 权限请求失败
             */
            @Override
            public void onDenied() {
                if (ObjectUtils.isNotEmpty(callBack)) callBack.failure();
                LogUtils.i("权限请求失败！");
            }
        }).request();
    }

    /**
     * 获取所有权限
     * @param context
     */
    public static void permissionAll(Context context){
        initUtils(context);
        PermissionUtils.permission(getPermisson(context)).callback(new PermissionUtils.SimpleCallback() {
            /**
             * 权限请求成功
             */
            @Override
            public void onGranted() {
                LogUtils.i("权限请求成功！");
            }

            /**
             * 权限请求失败
             */
            @Override
            public void onDenied() {
                LogUtils.i("权限请求失败！");
            }
        }).request();
    }

    public static String [] getPermisson(Context context){
        String [] permissions = null;
        try {
            PackageManager pm = context.getPackageManager();

            PackageInfo pi = pm.getPackageInfo(context.getPackageName(), 0);
            //得到自己的包名
            String pkgName = pi.packageName;

            PermissionGroupInfo pgi;
            PackageInfo pkgInfo = pm.getPackageInfo(pkgName, PackageManager.GET_PERMISSIONS);
            String sharedPkgList[] = pkgInfo.requestedPermissions;
            permissions = new String[sharedPkgList.length];
            for(int i=0;i<sharedPkgList.length;i++){
                String permName = sharedPkgList[i];
                permissions[i] = permName;
                LogUtils.i(permName);
            }
        }catch (Exception e){
            e.printStackTrace();
            LogUtils.i(e.getMessage());
        }
        return permissions;
    }

    /**
     * 权限判断
     * @param context
     * @return
     */
    public static boolean perFlag(Context context) {
        String[] prs = initPermission();
        for (int i = 0; i < prs.length; i++) {
            //Manifest.permission.READ_CONTACTS,android.permission.READ_CONTACTS
            if (ContextCompat.checkSelfPermission(context, prs[i]) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }

    public static String[] initPermission(){
        String [] pers = new String[7];
        pers[0] = Manifest.permission.CAMERA;
        pers[1] = Manifest.permission.INTERNET;
        pers[2] = Manifest.permission.READ_CONTACTS;
        pers[3] = Manifest.permission.READ_CALL_LOG;
        pers[4] = Manifest.permission.WRITE_EXTERNAL_STORAGE;
        pers[5] = Manifest.permission.RECORD_AUDIO;
        pers[6] = Manifest.permission.SEND_SMS;

        return pers;
    }

}
