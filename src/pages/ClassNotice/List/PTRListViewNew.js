import React from 'react';
import { PullToRefresh, ListView, Icon} from 'antd-mobile';
import moment from 'moment';
import { connect } from 'dva';
import { stringify } from 'qs';
import IconFont from '../../../components/IconFont';
import networkUtils from '../../../utils/networkUtils';
import nativeApi from '../../../utils/nativeApi';

let pageIndex = 1;

@connect(({notice}) => {
  return {...notice}
})
class PTRListViewNew extends React.PureComponent{
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.noticeId !== row2.noticeId,
    });

    this.state = {
      dataSource,
      refreshing: true,
      // height: document.documentElement.clientHeight,
      lastUpdateTime: moment().format('YYYY-MM-DD HH:mm'),
      listIsLoading: true,
      noticeList:  [],
      totalPageCount: 0,
      totalRecordCount: 0,
    };
  }

  componentDidMount() {
    pageIndex = 1;
    this.loadData(1, () => {
      // const {noticeList} = this.props;
      const {dataSource, noticeList} = this.state;
      this.rData = noticeList;
      this.setState({
        dataSource: dataSource.cloneWithRows(this.rData),
      });
    });
  }

  loadData = (pIndex, setDs) => {
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'notice/inquireCnNoticeByParentList',
    //   payload:{pageIndex: pIndex, pageSize: 20},
    // }).then(() => {
    //   if(setDs){
    //     const { isLoading, noticeList } = this.props;
    //     setDs(isLoading, noticeList);
    //   }
    // });
    this.setState({listIsLoading: true});
    const sessionUuid = networkUtils.getSessionUuid();

    fetch(`${nativeApi.getApiPath()}/store/api/v2.0/inquireCnNoticeByParentListAccount.json`,{
      method: 'POST',
      headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      body: stringify({sessionUuid, pageIndex: pIndex, pageSize: 20}),
    }).then(res => res.json())
      .then(resp => {
        this.setState({
          listIsLoading: false,
          noticeList: resp.datas || [],
          totalPageCount: resp.totalPageCount,
          totalRecordCount: resp.totalRecordCount,
        }, () => {
          this.forceUpdate();
        });
          if(setDs){
            // const { isLoading, noticeList } = this.props;
            const { listIsLoading, noticeList } = this.state;
            setDs(listIsLoading, noticeList);
          }
      });

  };

  // genData = () => {
  //   const { data } = this.props;
  //   if(data.length){this.forceUpdate()}
  //
  //   return data;
  // };

  setDs = (isLoading, data) => {
    const { dataSource } = this.state;
    if(!isLoading){
      this.rData = [...this.rData, ...data];
      this.setState({
        dataSource: dataSource.cloneWithRows(this.rData),
      });
    }
  };

  onEndReached = () => {
    // event.preventDefault();
    // const { isLoading, totalPageCount } = this.props;
    const { listIsLoading, totalPageCount } = this.state;
    if (listIsLoading || pageIndex >= totalPageCount) {
      return;
    }
    pageIndex+=1;
    this.loadData(pageIndex, this.setDs);
  };

  onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      pageIndex = 1;
      this.loadData(pageIndex, this.setRefresh);
    });
  };

  setRefresh = () => {
    // const { noticeList } = this.props;
    const { noticeList } = this.state;
    this.rData = noticeList;
    // const { dataSource } = this.state;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.noticeId !== row2.noticeId,
    });
    this.setState({
      dataSource: dataSource.cloneWithRows(this.rData),
      refreshing: false,
    }, () => {
      this.forceUpdate();
    });
  };

  render() {
    // const { updateTime, useBodyScroll, renderRow, other, totalRecordCount, isLoading } = this.props;
    const { updateTime, useBodyScroll, renderRow, } = this.props;
    const {
      dataSource,
      refreshing,
      lastUpdateTime,
      listIsLoading,
      totalRecordCount,
    } = this.state;
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );

    const row = (rowData, sectionID, rowID) => {
      return renderRow(rowData, sectionID, rowID);
    };

    return(
      <React.Fragment>
        {totalRecordCount ? (
          <div>
            { refreshing && updateTime ? <div style={{textAlign: 'center', border: 'none'}}>上次更新 {lastUpdateTime}</div> : null }
            <ListView
              ref={el => {this.lv = el}}
              dataSource={dataSource}
              renderRow={row}
              renderSeparator={separator}
              className="am-list"
              useBodyScroll={useBodyScroll}
              scrollRenderAheadDistance={50}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={10}
              pageSize={20}
              renderFooter={
                () => {
                // const { listIsLoading } = this.state;
                return (
                  <div style={{ padding: 30, textAlign: 'center' }}>
                    {listIsLoading ? '加载中...' : '加载完毕'}
                  </div>
                )}
              }
             // {...other}
              pullToRefresh={
                <PullToRefresh
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                  indicator={{ activate: `上次更新${lastUpdateTime}` }}
                />
              }
            />
          </div>
        ) : (
          <div style={{marginTop:'50%', textAlign: 'center'}}>
            { listIsLoading ? <Icon type='loading' />: (
              <span>
                <IconFont type='iconimg_empty_withbg-copy' style={{fontSize: '200px'}} />
                <br />
                 暂无数据
              </span>
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default PTRListViewNew;
