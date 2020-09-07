import React from 'react';
import { Modal, Tree, message, Tabs, Row, Col, Radio, Input, List, Icon, Spin, Button } from 'antd';
import { connect } from 'dva';

import styles from './index.less';

const { TabPane } = Tabs;
const RadioGroup = Radio.Group;
const { TreeNode } = Tree;
const { DirectoryTree } = Tree;
const { Search } = Input;
const ListItem = List.Item;

@connect(({ companySelector }) => ({
  companyDatas: companySelector.companyDatas,
  zoneDatas: companySelector.zoneDatas,
  loading: companySelector.loading,
}))
class CompanySelector extends React.Component{
  state = {
    confirmLoading: false,
    selectCompany: [],
    directly: 1,
    pageSize: 10000,
    checkedKeys: [],
    keyword: '',
  }

  componentDidMount() {
    const { directly, pageSize } = this.state;
    const param = {
      directly,
      pageSize,
    };
    this.inquireCompanyList(param);
  }

  inquireCompanyList = (param) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'companySelector/inquireSubordinateUnitListTenant',
      payload: param,
    });
    const { checkedKeys } = this.state;
    const keyIndex = checkedKeys.indexOf("0");
    if(keyIndex > -1){
      checkedKeys.splice(keyIndex,1);
      this.setState({checkedKeys});
    }
  }

  handleOk = (callback) => {
    const { selectCompany } = this.state;
    if(selectCompany.length === 0){
      message.info("请选择单位", 3);
      return;
    }

    this.setState({confirmLoading: true});
    callback(selectCompany);
    // this.setState()
  }

  handleAfterClose = () => {
    this.setState({
      confirmLoading: false,
      selectCompany: [],
      checkedKeys: [],
      keyword:'',
    });
  }

  directlyRadioChange = (e) => {
    const { value } = e.target;
    this.setState({directly: value});
    const { pageSize, keyword } = this.state;

    const param = {
      directly: value,
      pageSize,
      keyword,
    };
    this.inquireCompanyList(param);
  }

  onCheck = (checkedKeys, info) => {
    const { selectCompany }  = this.state;
    const existedKeys = this.state.checkedKeys;
    if(info.checked === false){
      const removeKeys = [];
      const { dataRef } = info.node.props;
      if(dataRef){
        removeKeys.push(dataRef.secondaryTenantId);
      }else{
        const { children } = info.node.props;
        children.forEach((child) => {
          const key = child.props.dataRef.secondaryTenantId;
          if(checkedKeys.indexOf(key) < 0){
            removeKeys.push(key);
          }
        });
      }

      const fliterSelect = selectCompany.filter((item) => (
        removeKeys.indexOf(item.secondaryTenantId) < 0
      ));
      this.setState({selectCompany: fliterSelect, checkedKeys});
      return;
    }

    info.checkedNodes.forEach((item) => {
      const key = item.key !== '0' ? item.props.dataRef.secondaryTenantId : 0;
      if(item.key !== '0' && existedKeys.indexOf(key) < 0){
        selectCompany.push(item.props.dataRef);
        existedKeys.push(key);
      }
    });

    this.setState({
      selectCompany,
      checkedKeys,
    });
  }

  removeCompany = (item) => {
    const { checkedKeys, selectCompany } = this.state;
    const removeKeys = checkedKeys.filter((key) =>
      parseInt(key, 10) !== parseInt(item.secondaryTenantId, 10)
    );
    const removeCompany = selectCompany.filter((each) =>
      parseInt(each.secondaryTenantId, 10) !== parseInt(item.secondaryTenantId, 10)
    );
    this.setState({
      checkedKeys: removeKeys,
      selectCompany: removeCompany,
    });
  }

  searchOnChange = (e) => {
    const { value } = e.target;
    this.setState({keyword: value});
    const { directly, pageSize } = this.state;
    const param = {
      directly,
      pageSize,
      keyword: value,
    }
    this.inquireCompanyList(param);
  }


  render() {
    const { visible, callback, onCancel, companyDatas, zoneDatas, loading } = this.props;
    const { confirmLoading, directly, selectCompany, checkedKeys } = this.state;
    const treeDatas = companyDatas || [];

    const companyTree = treeDatas.map((item) => (
      <TreeNode
        style={{width: '100%', overflow: 'hidden'}}
        title={<span className={styles.tree_node_ellipsis}>{item.secondaryTenantName}</span>}
        key={item.secondaryTenantId}
        dataRef={item}
        isLeaf
      />
    ));

    return (
      <Modal
        title='单位选择器'
        visible={visible}
        onOk={() => { this.handleOk(callback) }}
        confirmLoading={confirmLoading}
        afterClose={this.handleAfterClose}
        onCancel={onCancel}
        width={750}
        destroyOnClose
        footer={<Button>重置</Button>}
      >
        <Row gutter={24}>
          <Col span={12}>
            <div className={styles.company_tree_border}>
              <Tabs>
                <TabPane tab='下级单位' key='1'>
                  <div className={styles.radio_box}>
                    <span>
                      <RadioGroup onChange={this.directlyRadioChange} value={directly}>
                        <Radio value={0}>所有</Radio>
                        <Radio value={1}>仅直属</Radio>
                      </RadioGroup>
                    </span>
                    <span>
                      <Search style={{ width: '54%'}} onChange={this.searchOnChange} placeholder='请输入单位名称搜索' />
                    </span>
                  </div>
                  <div className={styles.tree_scroll_y}>
                    {
                      loading ? (
                        <Spin />
                      ) : (
                        <DirectoryTree
                          multiple
                          defaultExpandAll
                          checkable
                          checkedKeys={checkedKeys}
                          onCheck={this.onCheck}
                        >
                          <TreeNode title='全选' key={0}>
                            {companyTree || '' }
                          </TreeNode>
                        </DirectoryTree>
                      )
                    }
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </Col>
          <Col span={12}>
            <div className={`${styles.company_tree_border} ${styles.select_company_scroll_y}`} style={{overflowY: 'scroll'}}>
              <List
                style={{height: '490px'}}
                split
                dataSource={selectCompany}
                renderItem={item => (
                  <ListItem
                    className={styles.listItem}
                    actions={[<Icon className={styles.deleteIcon} onClick={() => { this.removeCompany(item) }} type="delete" theme="filled" />]}
                  >
                    {<span title={item.secondaryTenantName} style={{width: '270px'}} className={styles.tree_node_ellipsis}>{item.secondaryTenantName}</span> }
                  </ListItem>
                )}
              />
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default CompanySelector;
