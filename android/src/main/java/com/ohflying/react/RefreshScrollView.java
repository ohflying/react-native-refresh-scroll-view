package com.ohflying.react;


import android.util.Log;
import android.view.MotionEvent;
import android.view.VelocityTracker;
import android.widget.OverScroller;
import android.widget.ScrollView;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.views.scroll.FpsListener;
import com.facebook.react.views.scroll.ReactScrollView;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

import javax.annotation.Nullable;

/**
 * Created by admin on 2017/9/26.
 */

public class RefreshScrollView extends ReactScrollView {
    private VelocityTracker mTracker =  VelocityTracker.obtain();
    private Scroller mScroller = null;
    public RefreshScrollView(ReactContext context) {
        this(context, null);
    }

    public RefreshScrollView(ReactContext context, @Nullable FpsListener fpsListener) {
        super(context, fpsListener);
        mScroller = new Scroller(this);
    }

    public boolean onInterceptTouchEvent(MotionEvent event) {
        int action = event.getAction() & MotionEvent.ACTION_MASK;

        if (action == MotionEvent.ACTION_DOWN) {
            mTracker.clear();
            mScroller.stopScroll();
        }

        mTracker.addMovement(event);

        if (action == MotionEvent.ACTION_UP) {
            mTracker.computeCurrentVelocity(1000, 24000);
        }

        return super.onInterceptTouchEvent(event);
    }

    public void fling() {
        float vy = mTracker.getYVelocity();
        this.fling((int)-vy);
    }

    private class Scroller {
        private ScrollView scrollView;
        private Object mScroller;
        private Method mAbortAnimationMethod;
        Scroller(ScrollView scrollView) {
            this.scrollView = scrollView;
            init();
        }

        private void init() {
            try {
                Field mScrollerField = ScrollView.class.getDeclaredField("mScroller");
                mScrollerField.setAccessible(true);
                mScroller = mScrollerField.get(scrollView);

                Class<?> c = mScroller.getClass();
                mAbortAnimationMethod = c.getDeclaredMethod("abortAnimation");

            } catch (Exception e) {
                Log.w(ReactConstants.TAG, "Failed to get abortAnimation method for ScrollView!");
            }
        }

        private void stopScroll() {
            if (mScroller == null || mAbortAnimationMethod == null) {
                return;
            }

            try {
                mAbortAnimationMethod.invoke(mScroller);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
