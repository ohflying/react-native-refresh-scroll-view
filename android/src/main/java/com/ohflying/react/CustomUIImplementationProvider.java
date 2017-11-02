package com.ohflying.react;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.UIImplementation;
import com.facebook.react.uimanager.UIImplementationProvider;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.events.EventDispatcher;

import java.util.List;

public class CustomUIImplementationProvider extends UIImplementationProvider {
    //#ifdef version < 0.49
    public UIImplementation createUIImplementation(ReactApplicationContext reactContext, List<ViewManager> viewManagers, EventDispatcher eventDispatcher) {
        return new CustomUIImplementation(reactContext, viewManagers,eventDispatcher);
    }
    //#endif

    //#ifdef version >= 0.49
    public UIImplementation createUIImplementation(ReactApplicationContext reactContext, List<ViewManager> viewManagers, EventDispatcher eventDispatcher, int minTimeLeftInFrameForNonBatchedOperationMs) {
        return new CustomUIImplementation(reactContext, viewManagers, eventDispatcher, minTimeLeftInFrameForNonBatchedOperationMs);
    }
    //#endif
}
