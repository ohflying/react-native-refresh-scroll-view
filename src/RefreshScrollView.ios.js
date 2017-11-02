import React from 'react';
import { ScrollView, UIManager, requireNativeComponent } from 'react-native';
import nullthrows from 'fbjs/lib/nullthrows';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';

export default class RefreshScrollView extends ScrollView {
    stopFling() {
        UIManager.dispatchViewManagerCommand(
            nullthrows(this.scrollResponderGetScrollableNode()),
            UIManager.RCTScrollView.Commands.stopFling,
            []
        );

        if (global.nativeFlushQueueImmediate) {
            let queue = BatchedBridge.flushedQueue();
            global.nativeFlushQueueImmediate(queue);
        }
    }

    fling(velocity, deceleration) {
        UIManager.dispatchViewManagerCommand(
            nullthrows(this.scrollResponderGetScrollableNode()),
            UIManager.RCTScrollView.Commands.fling,
            [velocity, deceleration]
        );

        if (global.nativeFlushQueueImmediate) {
            let queue = BatchedBridge.flushedQueue();
            global.nativeFlushQueueImmediate(queue);
        }
    }

    _scrollViewRef:?ScrollView = null;
    _setScrollViewRef = (ref: ?ScrollView) => {
        this._scrollViewRef = ref;
    };

    render() {
        let component = super.render();
        return React.cloneElement(<ScrollView />, {
            ...component.props,
            ref: this._setScrollViewRef
        });
    }
}