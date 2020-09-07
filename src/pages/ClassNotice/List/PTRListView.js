import React from 'react';
import ReactDOM from 'react-dom';
import { PullToRefresh, ListView} from 'antd-mobile';
import moment from 'moment';

let pageIndex = 1;

class PTRListView extends React.PureComponent{
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) =>{
        return row1.noticeId !== row2.noticeId
      },
    });

    this.state = {
      dataSource,
      refreshing: true,
      height: document.documentElement.clientHeight,
      lastUpdateTime: moment().format('YYYY-MM-DD HH:mm')
    };
  }

  componentDidMount() {
    const { height, dataSource } = this.state;
    const hei = height - ReactDOM.findDOMNode(this.lv).offsetTop;

    this.rData = this.genData();
    this.setState({
      dataSource: dataSource.cloneWithRows(this.genData()),
      height: hei,
      refreshing: false,
    });
  }

  componentDidUpdate() {
    const { useBodyScroll } = this.props;
    if (useBodyScroll) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }

  genData = () => {
    const { data } = this.props;
    if(data.length){this.forceUpdate()}

    return data;
  };

  onRefresh = () => {
    const { loadData } = this.props;
    this.setState({ refreshing: true }, () => {
      pageIndex = 1;
      loadData(pageIndex, this.setRefresh);
    });
  };

  setRefresh = () => {
    this.rData = this.genData();
    const { dataSource } = this.state;
    this.setState({
      dataSource: dataSource.cloneWithRows(this.rData),
      refreshing: false,
    });
  };

  onEndReached = () => {
    // hasMore: from backend data, indicates whether it is the last page, here is false
    const { isLoading, totalPageCount } = this.props;
    const { hasMore } = this.state;
    if (isLoading || pageIndex >= totalPageCount) {
      return;
    }
    const { loadData } = this.props;
    pageIndex+=1;
    loadData(pageIndex, this.setDs);
  };

  setDs = () => {
    const { isLoading } = this.props;
    const { dataSource } = this.state;
    if(!isLoading){
      this.rData = [...this.rData, ...this.genData()];
      this.setState({
        dataSource: dataSource.cloneWithRows(this.rData),
      });
    }
  };

  render() {
    const { updateTime, useBodyScroll, renderRow, other } = this.props;
    const { dataSource, height, refreshing, lastUpdateTime } = this.state;
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
      <div>
        { refreshing && updateTime ? <div style={{textAlign: 'center', border: 'none'}}>上次更新 {lastUpdateTime}</div> : null }
        <ListView
          key="0"
          ref={el => {this.lv = el}}
          dataSource={dataSource}
          renderRow={row}
          renderSeparator={separator}
          useBodyScroll={useBodyScroll}
          style={useBodyScroll ? {} : {
            height,
            margin: '5px 0',
          }}
          pullToRefresh={
            <PullToRefresh
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              indicator={{ activate: `上次更新${lastUpdateTime}` }}
            />
          }
          onEndReached={this.onEndReached}
          pageSize={5}
          {...other}
        />
      </div>
    );
  }
}

export default PTRListView;
