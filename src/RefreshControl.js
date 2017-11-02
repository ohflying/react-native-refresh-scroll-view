/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import PullState from './PullState';
import RefreshView from './RefreshView';

const SPRING_COEFFICIENT = 2.5;
const MAX_HEIGHT_COEFFICIENT = 2.0;

export default class RefreshControl extends React.PureComponent<*, *, *> {
    static defaultProps: Object = {
        refreshing: false,
        refreshViewHeight: 60
    };

    static propTypes: Object = {
        refreshing: PropTypes.bool,
        refreshViewHeight: PropTypes.number,
        onRefresh: PropTypes.func,
        RefreshView: PropTypes.element
    };

    rootViewRef: ?Object;
    refreshViewRef: ?Object;
    curPullState: number = PullState.IDLE;
    startValue: number = 0;
    constructor(props: any, context: any) {
        super(props, context);

        this.state = { bounceValue: new Animated.Value(0) };
    }

    componentDidMount() {
        if (this.props.refreshing) {
            this._updatePullState(PullState.REFRESHING);
        }
    }

    render() {
        return (
            <Animated.View ref={this._setRootViewRef} style={{height: this.state.bounceValue, overflow: 'hidden'}}>
                {this._renderRefreshView()}
            </Animated.View>
        );
    }

    getRefreshState() {
        return this.curPullState;
    }

    endRefresh(): void {
        setTimeout(() => this._updatePullState(PullState.IDLE), 100);
    }

    refresh(): void {
        setTimeout(() => this._updatePullState(PullState.REFRESHING), 100);
    }

    startTouch(): void {
        this.startValue = this.state.bounceValue.__getValue();
    }

    pullDown(offset: number): void {
        let distance = Math.round(this.props.refreshViewHeight * SPRING_COEFFICIENT * (1 - Math.pow(Math.E, -0.002 * offset)));
        distance = Math.min(distance + this.startValue, this.props.refreshViewHeight * MAX_HEIGHT_COEFFICIENT);

        if (this.curPullState < PullState.READY && distance >= this.props.refreshViewHeight) {
            this._updatePullState(PullState.READY);
        } else if (this.curPullState === PullState.IDLE) {
            this._updatePullState(PullState.PULLING);
        }

        this.state.bounceValue.setValue(distance);
        this.rootViewRef && this.rootViewRef.setNativeProps({style: {height: distance}});

        this.refreshViewRef && this.refreshViewRef.onSizeChanged(distance, this.props.refreshViewHeight);
    }

    release(): boolean {
        let handled = false;
        switch (this.curPullState) {
        case PullState.PULLING:
            this._updatePullState(PullState.IDLE);
            handled = true;
            break;
        case PullState.READY:
            this._updatePullState(PullState.REFRESHING);
            handled = true;
            break;
        case PullState.REFRESHING:
            this._updatePullState(PullState.REFRESHING);
            break;
        }

        return handled;
    }

    _setRootViewRef = (ref: ?Object) => {
        this.rootViewRef = ref;
    };

    _setRefreshViewRef = (ref: ?Object) => {
        this.refreshViewRef = ref;
    };

    _renderRefreshView(): React.Component<*, *, *> {
        let Component = this.props.RefreshView || RefreshView;
        return (<Component ref={this._setRefreshViewRef} />);
    };

    _updatePullState(state: number): void {
        switch (state) {
        case PullState.IDLE:
            this._toIdle(); break;
        case PullState.REFRESHING:
            this._toRefreshing(); break;
        }

        this._onPullStateChanged(state);
    }

    _onPullStateChanged(state: number): void {
        if (state === this.curPullState) {
            return;
        }

        this.curPullState = state;
        this.refreshViewRef && this.refreshViewRef.onPullStateChanged(state);

        if (this.curPullState === PullState.REFRESHING && this.props.onRefresh) {
            this.props.onRefresh();
        }
    }

    _toIdle(): void {
        Animated.timing(this.state.bounceValue, {
            duration: 300,
            toValue: 0
        }).start();
    }

    _toRefreshing(): void {
        Animated.timing(this.state.bounceValue, {
            duration: 300,
            toValue: this.props.refreshViewHeight
        }).start();
    }
}
