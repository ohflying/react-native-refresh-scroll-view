package com.ohflying.react;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIImplementation;
import com.facebook.react.uimanager.UIViewOperationQueue;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.ViewManagerRegistry;
import com.facebook.react.uimanager.events.EventDispatcher;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CustomUIImplementation extends UIImplementation {
    //#ifdef version < 0.49
    public CustomUIImplementation(ReactApplicationContext reactContext, List<ViewManager> viewManagers, EventDispatcher eventDispatcher) {
        super(reactContext, new ViewManagerRegistry(viewManagers), eventDispatcher);
    }
    //#endif

    //#ifdef version >= 0.49
    public CustomUIImplementation(ReactApplicationContext reactContext, List<ViewManager> viewManagers, EventDispatcher eventDispatcher, int minTimeLeftInFrameForNonBatchedOperationMs) {
        super(reactContext, viewManagers, eventDispatcher, minTimeLeftInFrameForNonBatchedOperationMs);
    }
    //#endif

    public void dispatchViewManagerCommand(int reactTag, int commandId, ReadableArray commandArgs) {
        super.dispatchViewManagerCommand(reactTag, commandId, commandArgs);
        if (FlushImmediatelyCommandManager.getInstance().needFlushImmediately(commandId)) {
            flushQueue();
        }
    }

    private void flushQueue() {
        try {
            this.dispatchViewUpdates(-1);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
