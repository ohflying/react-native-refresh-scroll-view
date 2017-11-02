package com.ohflying.react;

import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.scroll.ReactScrollView;
import com.facebook.react.views.scroll.ReactScrollViewManager;

import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by admin on 2017/9/26.
 */

public class RefreshScrollViewViewManager extends ReactScrollViewManager {
    public static final int COMMAND_FLING = 0xE00001;
    public RefreshScrollViewViewManager() {
        super();

        FlushImmediatelyCommandManager.getInstance().addFlushImmediatelyCommand(new Integer[]{COMMAND_FLING});
    }

    @Override
    public String getName() {
        return RefreshScrollView.class.getSimpleName();
    }

    @Override
    public ReactScrollView createViewInstance(ThemedReactContext context) {
        return new RefreshScrollView(context);
    }

    @Override
    public @Nullable
    Map<String, Integer> getCommandsMap() {
        Map<String, Integer> commandMap = super.getCommandsMap();
        commandMap.put("fling", COMMAND_FLING);
        return commandMap;
    }

    @Override
    public void receiveCommand(
            ReactScrollView scrollView,
            int commandId,
            @Nullable ReadableArray args) {
        if (commandId == COMMAND_FLING) {
            fling(scrollView);
            return;
        }

        super.receiveCommand(scrollView, commandId, args);
    }

    public void fling(ReactScrollView view) {
        ((RefreshScrollView)view).fling();
    }
}
