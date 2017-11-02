/* @flow */

import React from 'react';
import { View, Text, Image, Animated } from 'react-native';
import PullState from './PullState';
import LoadingSrc from '../res/loading.png';

export default class RefreshView extends React.PureComponent {
    constructor(props: Object, context: Object) {
        super(props, context);

        this.state = {hint: '', progress: new Animated.Value(0)};
    }

    onPullStateChanged(pullState: number) {
        console.log('onPullStateChanged=' + pullState);
        let hint;
        switch (pullState) {
        case PullState.PULLING:
            hint = '下拉刷新'; break;
        case PullState.READY:
            hint = '松手刷新'; break;
        case PullState.REFRESHING:
            hint = '正在刷新'; this.startLoadingAnimation(); break;
        case PullState.IDLE:
            this.stopLoadingAnimation(); break;
        default:
            hint = null; break;
        }

        this.pullState = pullState;
        hint && this.setState({ hint });
    }

    startLoadingAnimation() {
        let duration = (1 - (this.state.progress._value > 1 ? 1 - this.state.progress._value : this.state.progress._value)) * 1000;

        if (this._animator) {
            this._animator.stop();
        }

        this._animator = Animated.timing(this.state.progress, {
            toValue: 1,
            duration: duration
        });
        this._animator.start(() => {
            if (this.pullState === PullState.REFRESHING) {
                this.setState({ progress: new Animated.Value(0) });
                this.startLoadingAnimation();
            }
        });
    }

    stopLoadingAnimation() {
        if (this._animator) {
            this._animator.stop();
        }
    }

    onSizeChanged(distance, height) {
        if (this.pullState === PullState.REFRESHING) {
            return;
        }

        let progress = distance / height;
        progress = progress > 1 ? (progress - 1) : progress;
        this.setState({
            progress: new Animated.Value(progress)
        });
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Animated.View style={{transform: [{rotate: this.state.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '355deg']
                })}]}} >
                    <Image style={{width: 30, height: 30}} source={LoadingSrc} />
                </Animated.View>
                <Text style={{paddingLeft: 20, fontSize: 18, color: '#999'}}>{this.state.hint}</Text>
            </View>
        );
    }
}
