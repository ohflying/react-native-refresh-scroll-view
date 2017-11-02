/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { RefreshFlatList } from 'react-native-refresh-scroll-view';

import NewsService from './NewsService';

class SeparatorView extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <View style={{height: StyleSheet.hairlineWidth, backgroundColor: '#999', margin: 10}} />
        );
    }
}

class LoadMoreView extends React.Component {
    static propTypes: Object = {
        loadMore: PropTypes.func.isRequired
    };

    static LOAD_STATE = {
        IDLE: 1,
        LOADING: 2,
        ERROR: 3
    };
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            loadState: LoadMoreView.LOAD_STATE.IDLE
        };
    }

    async load() {
        if (this.state.loadState === LoadMoreView.LOAD_STATE.LOADING) {
            return;
        }

        this.setState({
            loadState: LoadMoreView.LOAD_STATE.LOADING
        });

        try {
            await (this.props.loadMore && this.props.loadMore());

            this.setState({
                loadState: LoadMoreView.LOAD_STATE.IDLE
            });
        } catch (e) {
            this.setState({
                loadState: LoadMoreView.LOAD_STATE.ERROR
            });
        }
    }

    _reload() {
        this.load();
    }

    _renderViewWithState() {
        if (this.state.loadState === LoadMoreView.LOAD_STATE.LOADING) {
            return <Text style={{fontSize: 18, color: '#999'}}>正在加载...</Text>;
        }

        if (this.state.loadState === LoadMoreView.LOAD_STATE.ERROR) {
            return <Text onPress={this._reload} style={{fontSize: 18, color: '#999'}}>点击加载更多</Text>;
        }
    }

    render() {
        if (this.state.loadState === LoadMoreView.LOAD_STATE.IDLE) {
            return <View />;
        }

        return (
            <View style={{height: 60, justifyContent: 'center', alignItems: 'center'}}>
                {this._renderViewWithState()}
            </View>
        );
    }
}

export default class App extends React.Component {
    _curPage: number = 1;
    _loadMoreRef: Object = null;
    constructor(props: any, context: any) {
        super(props, context);

        this.state = { refreshing: true, data: [] };
    }

    onRefresh = async () => {
        setTimeout(async () => {
            try {
                let result = await NewsService.fetchNews(1);
                this.setState({
                    data: result,
                    refreshing: false
                });
                this._curPage = 1;
            } catch (err) {
                console.log(err);
                this.setState({
                    refreshing: false
                });
            }
        }, 5000);
    };

    onLoadMore = () => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    let result = await NewsService.fetchNews(++this._curPage);
                    this.setState({
                        data: this.state.data.concat(result)
                    });
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }, 5000);
        });
    };

    onEndReached = () => {
        if (this._loadMoreRef && this._loadMoreRef.load) {
            this._loadMoreRef.load();
        }
    };

    _setLoadMoreRef = (ref) => {
        this._loadMoreRef = ref;
    };

    _renderFooterView() {
        return (
            <LoadMoreView ref={this._setLoadMoreRef} loadMore={this.onLoadMore} />
        );
    }

    renderItem({item}): React.Element {
        return (
            <View style={{flex: 1, padding: 10}}>
                <Text style={{fontSize: 18, paddingBottom: 10}}>{item.title}</Text>
                <Image source={{uri: item.picUrl}} resizeMode="cover" style={{width: '100%', minHeight: 200, backgroundColor: '#ccc'}} />
            </View>
        );
    }

    render() {
        return (
            <View style={{marginTop: Platform.OS === 'ios' ? 30: 0, flex: 1}}>
                <RefreshFlatList
                    data={this.state.data}
                    enabledRefresh={true}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    renderItem={this.renderItem}
                    getItemLayout={this.getItemLayout}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={this._renderFooterView()}
                    ItemSeparatorComponent={SeparatorView}
                />
            </View>
        );
    }
};
