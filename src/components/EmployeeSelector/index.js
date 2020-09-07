import React from 'react';
import { Modal, Tree, message, Tabs, Row, Col, Input, List, Icon, Spin, Button } from 'antd';
import { connect } from 'dva';
import { datasToMap } from '@/utils/utils';

import styles from './index.less';

const { TabPane } = Tabs;
const { TreeNode } = Tree;
const { DirectoryTree } = Tree;
const { Search } = Input;
const ListItem = List.Item;
let datasMap = new Map();
let pcMap = new Map(); // 父子结构的数据
const eIdOrgs = {}; // 员工对应的（多个）部门
let rootNodes = [];
const orgEmpsMap = new Map(); // 存储部门下所有员工
const defaultExpandedKeys = [];

@connect(({ employeeSelector }) => ({
  ownDatas: employeeSelector.ownDatas,
  loading: employeeSelector.loading,
  ownSearchDatas:employeeSelector.ownSearchDatas,
  ownSearchLoading: employeeSelector.ownSearchLoading,
}))
class EmployeeSelector extends React.Component{
  state = {
    confirmLoading: false,
    selectEmployee: [],
    directly: 1,
    pageSize: 10000,
    checkedKeys: [],
    keyword: '',
    ownAllDisplay: 'block',
    ownSearchDisplay: 'none',
  }

  componentDidMount() {
    const { directly, pageSize } = this.state;
    const param = {
      directly,
      pageSize,
    };
    this.inquireCompanyEmployeeList(param);
  }

  inquireCompanyEmployeeList = (param) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeSelector/inquireOwnOrganizationTreeTenant',
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
    const { selectEmployee } = this.state;
    if(selectEmployee.length === 0){
      message.info("请选择人员", 3);
      return;
    }

    this.setState({confirmLoading: true});
    callback(selectEmployee);
  }

  handleAfterClose = () => {
    this.setState({
      confirmLoading: false,
      selectEmployee: [],
      checkedKeys: [],
      keyword:'',
      ownAllDisplay: 'block',
      ownSearchDisplay: 'none',
    });
  }

  onCheck = (checkedKeys, info) => {
    const { selectEmployee }  = this.state;
    if(info.checked === false){
      const removeKeys = [];

      const { dataRef } = info.node.props;
      if(dataRef && dataRef.type === 'e'){ // children && children.length === 0
        const key = `${dataRef.treeId}`;
        removeKeys.push(key);
        this.removeParentNode(checkedKeys, key);
      }else{
        const { children } = info.node.props;
        children.forEach((child) => {
          const data = child.props.dataRef
          // 如果取消的节点下有部门节点
          if(data.type === 'o'){
            const oChildren = orgEmpsMap.get(data.treeId);
            removeKeys.push(...oChildren);
          }
          const key = `${ data.treeId}`;
          if(checkedKeys.indexOf(key) < 0){
            removeKeys.push(key);
          }
        });
      }

      const fliterSelect = selectEmployee.filter((item) => (
        removeKeys.indexOf(`${item.treeId}`) < 0
      ));

      this.setState({selectEmployee: fliterSelect, checkedKeys});
      return;
    }
    const existedKeys = this.state.checkedKeys;
    info.checkedNodes.forEach((item) => {
      const data = item.props.dataRef;
      const key = `${data.treeId}`;
      if(existedKeys.indexOf(key) < 0 && data.type !== 'o' && data.type !== 't'){
        selectEmployee.push(data);
        existedKeys.push(key);
      }
    });

    this.setState({
      selectEmployee,
      checkedKeys,
    });
  }

  /**
   * 移除父节点
   * @param checkedKeys
   * @param treeId
   */
  removeParentNode = (checkedKeys, treeId)  => {
    const parents = eIdOrgs[treeId];
    parents.forEach((pNode) => {
      const pIndex = checkedKeys.indexOf(pNode);
      if(pIndex > -1){
        checkedKeys.splice(pIndex, 1);
      }
    });
  }

  removeEmployee = (item) => {
    const { checkedKeys, selectEmployee } = this.state;
    const removeKeys = checkedKeys.filter((key) =>
      key!== `${item.treeId}`
    );
   this.removeParentNode(removeKeys, item.treeId);
    const removeEmployee = selectEmployee.filter((each) =>
      `${each.treeId}` !== `${item.treeId}`
    );
    this.setState({
      checkedKeys: removeKeys,
      selectEmployee: removeEmployee,
    });
  }

  rootChildrenDatas = (datas) => {
    this.handleEIdOrgs(datas);
    const keyDatas=[];
    datas.forEach((item) => {
      const dt = item;
      dt.key = item.treeId;
      dt.children = [];
      dt.duplicateRemoval = [];
      keyDatas.push(dt);
      if(item.type === 'o' || item.type === 't'){
        orgEmpsMap.set(item.treeId, []);
      }
      if(item.parentId === '0')
        defaultExpandedKeys.push(item.treeId);
    });

    datas.forEach((item) => {
      this.findEmpsOfOrg(item, item.parentId);
    });
    datasMap = datasToMap(keyDatas, 'treeId');
    pcMap = datasToMap(keyDatas, 'parentId', 'treeId');
    keyDatas.forEach((item) => {
      this.findChild(item.treeId, item.parentId);
    });
    const result = [];
    pcMap.forEach((value) => {
      if(value.parentId === '0'){
        result.push(value);
      }
    });
    rootNodes = result;
    return result;
  }

  handleEIdOrgs = (datas) => {
    datas.forEach((item) => {
      if(item.type === 'e'){
        const orgIds = eIdOrgs[item.treeId] ? eIdOrgs[item.treeId] : [];
        orgIds.push(item.parentId);
        eIdOrgs[item.treeId] = orgIds;
      }
    });
  }

  findChild = (treeId, parentId) => {
    const pNode = datasMap.get(parentId);
    if(pNode){
      // const cNode = datasMap.get(treeId); // 如果同一个人在多个部门，选择其中一个部门的该人另一个部门的该人会被选中
      const cNode = pcMap.get(`${parentId}-${treeId}`); // 如果同一个人在多个部门，选择其中一个部门的该人另一个部门的该人不会被选中
      const existed = pNode.duplicateRemoval.indexOf(cNode.treeId);
      if(existed < 0){
        pNode.children.push(cNode);
        pNode.duplicateRemoval.push(cNode.treeId);
        // datasMap.set(parentId, pNode); // 如果同一个人在多个部门，选择其中一个部门的该人另一个部门的该人会被选中
        pcMap.set(`${pNode.parentId}-${parentId}`, pNode);  // 如果同一个人在多个部门，选择其中一个部门的该人另一个部门的该人不会被选中
      }
    }

    if(pNode && pNode.parentId !== '0'){
      this.findChild(pNode.treeId, pNode.parentId);
    }
  }


  // 找出部门下所有人
  findEmpsOfOrg = (treeNode, parentId) => {
    const parentNode = datasMap.get(parentId);
    if(parentNode){
      orgEmpsMap.get(parentNode.treeId).push(treeNode.treeId);
    }
    if(parentNode && parentNode.parentId !== '0'){
      this.findEmpsOfOrg(treeNode, parentNode.parentId);
    }
  }


  setTreeKey = (currentNode,currentParentId, treeId, parentId) => {
      const data = pcMap.get(`${currentParentId}-${currentNode}`);
      const parentNode = datasMap.get(parentId);
      const key = parentNode ? `${parentId}-${data.key}` : data.treeId ;
      data.key = key;
      pcMap.set(`${currentParentId}-${currentNode}`, data);
      if(parentNode && parentNode.parentId !== '0'){
        this.setTreeKey(currentNode, currentParentId, parentNode.treeId, parentNode.parentId);
      }
  }

  treeTitle = (item) => item.name + (item.positionName ? `（${item.positionName}）` : '');

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={this.treeTitle(item)} key={`${item.treeId}`} dataRef={item} isLeaf={item.type !== 'o' && item.type !== 't'}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.name} key={`${item.treeId}`} dataRef={item} isLeaf={item.type !== 'o' && item.type !== 't'} />;
  })

  renderSearchTreeNodes = datas => datas.map((item) => (
    <TreeNode title={this.treeTitle(item)} key={`${item.treeId}`} dataRef={item} isLeaf />

  ));

  searchByKeywords = (e) => {
    e.preventDefault();
    const { value } = e.target;
    if(value.length === 0){
      this.setState({
        ownAllDisplay: 'block',
        ownSearchDisplay: 'none',
        keyword: '',
      });
      return;
    }
    this.setState({
      ownAllDisplay: 'none',
      ownSearchDisplay: 'block',
      keyword: value,
    });
    const { dispatch } = this.props;
    const param =  { keyword: value, pageSize: 1000 };
    dispatch({
      type: 'employeeSelector/inquireOwnOrganizationTreeByKeywordTenant',
      payload: param,
    });
  }

  render() {
    const { visible, callback, onCancel, ownDatas, loading, ownSearchLoading, ownSearchDatas } = this.props;
    const { confirmLoading, selectEmployee, checkedKeys, ownAllDisplay, ownSearchDisplay, keyword } = this.state;
    const treeDatas = this.rootChildrenDatas(ownDatas) || [];
    const ownSearcMap = new Map();
    ownSearchDatas.forEach((emp) => {
      ownSearcMap.set(emp.treeId, emp);
    });
    ownSearchDatas.length = 0;
    ownSearchDatas.push(...ownSearcMap.values());

    return (
      <Modal
        title='人员选择器'
        visible={visible}
        onOk={() => { this.handleOk(callback) }}
        confirmLoading={confirmLoading}
        afterClose={this.handleAfterClose}
        onCancel={onCancel}
        width={750}
        destroyOnClose
        footer={[
          <Button key="reset" onClick={this.handleAfterClose}>清空</Button>,
          <Button key='cancel' onClick={onCancel}>取消</Button>,
          <Button key='ok' type="primary" onClick={() => { this.handleOk(callback) }}>确定</Button>
        ]}
      >
        <Row gutter={24}>
          <Col span={12}>
            <div className={styles.company_tree_border}>
              <Tabs>
                <TabPane tab='本单位' key='1'>
                  <div className={styles.radio_box}>
                    <span>
                      <Search value={keyword} onChange={this.searchByKeywords} placeholder='请输入姓名、职位、拼音简称' />
                    </span>
                  </div>
                  <div className={styles.tree_scroll_y} style={{display: ownAllDisplay}}>
                    {
                      loading ? (
                        <Spin />
                      ) : (
                        <DirectoryTree
                          multiple
                          defaultExpandedKeys={defaultExpandedKeys}
                          checkable
                          checkedKeys={checkedKeys}
                          onCheck={this.onCheck}
                        >
                          {this.renderTreeNodes(treeDatas) || '' }
                        </DirectoryTree>
                      )
                    }
                  </div>
                  <div className={styles.tree_scroll_y} style={{display: ownSearchDisplay}}>
                    {
                      ownSearchLoading  ? (
                        <Spin />
                      ) : (
                        <DirectoryTree
                          multiple
                          defaultExpandedKeys={defaultExpandedKeys}
                          checkable
                          checkedKeys={checkedKeys}
                          onCheck={this.onCheck}
                        >
                          {  this.renderSearchTreeNodes(ownSearchDatas) || '' }
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
                dataSource={selectEmployee}
                renderItem={item => (
                  <ListItem
                    className={styles.listItem}
                    actions={[<Icon className={styles.deleteIcon} onClick={() => { this.removeEmployee(item) }} type="delete" theme="filled" />]}
                  >
                    {
                      <span title={item.name} style={{width: '270px'}} className={styles.tree_node_ellipsis}>
                        {this.treeTitle(item)}
                      </span>
                    }
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

export default EmployeeSelector;
