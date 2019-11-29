package com.yy.utils;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PermissionGroupInfo;

import com.blankj.utilcode.util.ObjectUtils;
import com.blankj.utilcode.util.PermissionUtils;
import com.blankj.utilcode.util.Utils;

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

}
