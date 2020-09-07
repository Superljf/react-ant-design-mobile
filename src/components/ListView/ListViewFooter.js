import React, { Component } from 'react';
import { ActivityIndicator } from "antd-mobile";
import styles from "./ListViewFooter.less";

export default class ListViewFooter extends Component {
    render() {
        const {
            loading,
            hasMore,
        } = this.props;
        return (
            <div className={styles.loadMore} >
                {loading ? (
                    <div className={styles.loading}>
                        <ActivityIndicator size="small" />
                        <span className={styles.loadText} >正在加载中...</span>
                    </div>
                ) : hasMore ? "加载完成" : "这是底线"}
            </div>
        )
    }
}
