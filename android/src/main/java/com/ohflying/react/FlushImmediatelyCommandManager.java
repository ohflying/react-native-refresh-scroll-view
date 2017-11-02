package com.ohflying.react;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by admin on 2017/10/11.
 */

public class FlushImmediatelyCommandManager {
    static Object _sLocker = new Object();
    static FlushImmediatelyCommandManager _sInstance;

    public static FlushImmediatelyCommandManager getInstance() {
        if (_sInstance == null) {
            synchronized (_sLocker) {
                if (_sInstance == null) {
                    _sInstance = new FlushImmediatelyCommandManager();
                }
            }
        }

        return _sInstance;
    }

    private List<Integer> mFlushImmediatelyCommandIds = new ArrayList<Integer>();
    private FlushImmediatelyCommandManager() {}

    public void addFlushImmediatelyCommand(Integer[] commandIds) {
        mFlushImmediatelyCommandIds.addAll(Arrays.asList(commandIds));
    }

    public boolean needFlushImmediately(Integer commandId) {
        return mFlushImmediatelyCommandIds.contains(commandId);
    }
}
