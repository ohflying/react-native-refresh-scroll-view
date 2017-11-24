/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, PanResponder, StyleSheet } from 'react-native';

import RefreshScrollView from './RefreshScrollView';
import RefreshControl from './RefreshControl';
import PullState from './PullState';

const DEFAULT_DECELERATION = 0.998;

class RefreshFlatList extends React.PureComponent<*, *, *> {
    static defaultProps = {
        enabledRefresh: true,
        refreshing: false
    };

    static propTypes = {
        enabledRefresh: PropTypes.bool,
        refreshing: PropTypes.bool,
        refreshListener: PropTypes.object,
        onRefresh: PropTypes.func,
        RefreshView: PropTypes.element,
        onEndReached: PropTypes.func
    };

    startScrollOffset: number = 0;
    header: ?Object;
    constructor(props: any, context: any) {
        super(props, context);

        this.gestureHandler = PanResponder.create({
            onStartShouldSetPanResponder: this._handleOnShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleOnShouldSetPanResponder,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderRelease,
            onPanResponderTerminate: this._handlePanResponderRelease,
            onPanResponderTerminationRequest: () => false
        });
    }

    _handleOnShouldSetPanResponder = (): boolean => {
        return this.props.enabledRefresh;
    };

    _handlePanResponderGrant = (e: Object, gestureState: Object): void => {
        // fix gestureState.vx very small when quick slide in iOS
        gestureState._accountsForMovesUpTo = e.touchHistory.mostRecentTimeStamp;

        this.startScrollOffset = this.getCurScrollMetrics().offset;
        this.headerRef && this.headerRef.startTouch();

        this.getScrollViewRef().stopFling();
    };

    _handlePanResponderMove = (e: Object, gesture: Object) => {
        if (gesture.dy > 0 && this.startScrollOffset - gesture.dy < 0) { // pull down
            return this.headerRef && this.headerRef.pullDown(Math.abs(this.startScrollOffset - gesture.dy));
        }

        let offset = this.startScrollOffset - gesture.dy;
        let scrollMetrics = this.getCurScrollMetrics();
        if (this.startScrollOffset - gesture.dy > scrollMetrics.contentLength - scrollMetrics.visibleLength) { // pull up
            return;
        }

        this.listRef.scrollToOffset({offset: offset, animated: false});
    };

    _handlePanResponderRelease = (e: Object, gesture: Object): void => {
        if (this.headerRef.release()) {
            return;
        }

        this.getScrollViewRef().fling(-gesture.vy, DEFAULT_DECELERATION);
    };

    getScrollViewRef() {
        return this.getVirtualizedListRef()._scrollRef;
    }

    getVirtualizedListRef() {
        return this.listRef._listRef;
    }

    getCurScrollMetrics() {
        return this.getVirtualizedListRef()._scrollMetrics;
    }

    _setListRef = (ref: ?Object) => {
        this.listRef = ref;
    };

    _setHeaderRef = (ref: ?Object) => {
        this.headerRef = ref;
    };

    _onEndReached = (info) => {
        if (this.props.onEndReached && (!this.headerRef || this.headerRef.getRefreshState() === PullState.IDLE)) {
            this.props.onEndReached(info);
        }
    };

    _renderScrollComponent = (props: any): React.Component<*, *, *> => {
        return <RefreshScrollView {...props}/>;
    };

    _renderHeader = (): React.Component<*, *, *> => {
        if (this.props.enabledRefresh && !this.header) {
            this.header = (
                <RefreshControl
                    key="$$RefreshHeader"
                    refreshing={this.props.refreshing}
                    onRefresh={this.props.onRefresh}
                    ref={this._setHeaderRef}
                />
            );
        } else if (this.headerRef) {
            if (!this.props.refreshing) {
                this.headerRef.endRefresh();
            } else {
                this.headerRef.refresh();
            }
        }

        if (this.props.ListHeaderComponent) {
            const element = React.isValidElement(this.props.ListHeaderComponent)
                ? this.props.ListHeaderComponent
                : <this.props.ListHeaderComponent />;
            return (
                <View key="$$Header">
                    {this.header}
                    {element}
                </View>
            );
        } else {
            return this.header;
        }
    };

    _renderFooter = (): React.Component<*, *, *> => {
        if (!this.props.ListFooterComponent) {
            return undefined;
        }

        return React.isValidElement(this.props.ListFooterComponent)
            ? this.props.ListFooterComponent
            : <this.props.ListFooterComponent />;
    };

    render() {
        let listProps = Object.assign({}, this.props, {
            renderScrollComponent: this.props.enabledRefresh ? this._renderScrollComponent : undefined,
            ListHeaderComponent: this._renderHeader(),
            ListFooterComponent: this._renderFooter(),
            scrollEnabled: !this.props.enabledRefresh,
            pointerEvents: 'box-none',
            ref: this._setListRef,
            bounces: false,
            onRefresh: undefined,
            onEndReached: this._onEndReached
        });

        return (
            <View style={styles.container} {...this.gestureHandler.panHandlers}>
                <FlatList {...listProps} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default RefreshFlatList;
