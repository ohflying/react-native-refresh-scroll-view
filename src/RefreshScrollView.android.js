import React from 'react';
import { ScrollView, UIManager, requireNativeComponent } from 'react-native';
import nullthrows from 'fbjs/lib/nullthrows';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';

let RNScrollView = requireNativeComponent(
    'RefreshScrollView',
    (RefreshScrollView: ReactClass<any>),
    {
        nativeOnly: {
            sendMomentumEvents: true
        }
    }
);

export default class RefreshScrollView extends ScrollView {
    stopFling() {}

    fling() {
        UIManager.dispatchViewManagerCommand(
            nullthrows(this.scrollResponderGetScrollableNode()),
            UIManager.RefreshScrollView.Commands.fling,
            []
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
        return React.cloneElement(<RNScrollView />, {
            ...component.props,
            ref: this._setScrollViewRef
        });
    }
}
