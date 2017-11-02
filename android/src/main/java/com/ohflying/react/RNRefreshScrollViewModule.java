
package com.ohflying.react;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class RNRefreshScrollViewModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNRefreshScrollViewModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNRefreshScrollViewModule";
    }
}