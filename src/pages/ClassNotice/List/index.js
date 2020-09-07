import React from 'react';
import {Icon} from 'antd';
import {Tag} from 'antd-mobile';
import {connect} from 'dva';
import router from 'umi/router';
import PTRListView from './PTRListViewNew';
import { downloadPath } from '../../../utils/constants';

@connect(({notice}) => {
  return {...notice}
})
class List extends React.PureComponent{
  renderFooter = () => {
    const { isLoading } = this.props;
    return (
      <div style={{ padding: 30, textAlign: 'center' }}>
        {isLoading ? '加载中...' : '加载完毕'}
      </div>
  )};

  renderRow = (rowData, sectionID, rowID) => {
    return (
      <div
        key={rowID}
        style={{
          padding: '15px',
          backgroundColor: rowData.readFlag===1 ? 'white' : '#E6FAF5',
        }}
        onClick={(e) => {
          e.preventDefault();
          router.push(`/plugin/parent/classnotice/detail?readFlag=${rowData.readFlag}&noticeParentId=${rowData.noticeParentId}`);
        }}
      >
        <h3 className='breakWord'>
          {rowData.readFlag === 0 ?(
            <span>
              <Tag small style={{backgroundColor: '#00CC99', color:'white'}}>
                未读
              </Tag>
              &nbsp;
            </span>
          ) : null}

          {rowData.title}
        </h3>
        <div>
          {rowData.accountPhoto ? <img width="20" style={{borderRadius: '10px'}} src={downloadPath+rowData.accountPhoto} alt="" /> : <Icon type="user" />}
          <span style={{padding:'10px', verticalAlign: 'middle', color: '#999999'}}>
            {rowData.accountName}&nbsp;{rowData.date}&nbsp;{rowData.updateFlag ? '修改' : '发布' }
          </span>

        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        <PTRListView
          useBodyScroll
          renderRow={this.renderRow}
          other={{
            renderFooter:this.renderFooter,
            // renderHeader: () => {},
          }}
        />
      </div>
    );
  }
}

export default List;
