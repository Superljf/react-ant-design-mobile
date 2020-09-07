import React, { Component, } from 'react';
import { connect } from 'dva';
import { Drawer, Icon } from 'antd';
import update from 'react-addons-update';
import classNames from 'classnames';
import styles from './MenuBar.less';
import ClassRow from './ClassRow';
import eventProxy from '../../utils/eventProxy'


@connect(({ classList, dynamicsList }) => ({
  classList, dynamicsList,
}))
class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isMore: false,
    }
  }

  componentDidMount() {
    this.getHeaderClassList()
    this.getCommonClassList();
  }

  // 查询班主任管理班级列表,包含任课班级和班主任管理的班级
  getHeaderClassList = () => {
    const { dispatch, dynamicsList: { accountInfo } } = this.props;
    const { accountId } = accountInfo;
    dispatch({
      type: 'classList/inquireClassesList',
      payload: {
        teacherId: accountId
      }
    })
  }

  // 查询当前学期码
  getCommonClassList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'classList/inquireCurrentSemester',
    }).then(() => {
      const { classList: { currentCode } } = this.props;
      const { semesterCode } = currentCode;
      // 教师授课班级
      dispatch({
        type: 'classList/inquireTeacherClassListCourse',
        payload: {
          semesterCode,
        }
      })
      dispatch({
        type: 'classList/inquireGradeClassListSelector',
        payload: {
          semesterCode,
        }
      })
    })
  }

  handleChangeSelectedClassId = (classId) => {
    const { dispatch, classList: { selectedId } } = this.props;
    if (selectedId === -1 && classId === -1) {
      this.setState({
        visible: true,
      })
    }
    dispatch({
      type: 'classList/changeSelectedClassId',
      payload: {
        classId,
      }
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  rrow = (gradeEnum, classList) => {
    const { selected, classIds } = this.state;
    return (
      <span>
        <ClassRow
          classList={classList}
          onRowClick={this.onRowClick}
          gradeEnum={gradeEnum}
          classIds={classIds}
          selected={selected}
        />
      </span>
    )
  }

  // 重置班级圈
  resetClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "classList/getSelectedClassList",
      payload: {
        selectedClassList: [],
      }
    })

  }

  // 班级圈点击确定查询
  queryClick = () => {
    const { classList: { selectedClassList }, dispatch } = this.props;
    dispatch({
      type: "classList/getCurrentSelectedClassList",
      payload: {
        currentSelectedClassList: selectedClassList,
      }
    })
    eventProxy.trigger('query', 'list')
    this.setState({
      visible: false,
    })
  }

  // 清空班级圈选中的班级
  handleClickClear = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "classList/getCurrentSelectedClassList",
      payload: {
        currentSelectedClassList: [],
      }
    });
    dispatch({
      type: "classList/getSelectedClassList",
      payload: {
        selectedClassList: [],
      }
    })
    eventProxy.trigger('clear', 'list')
  }

  renderSelectClass = () => {
    const { isMore } = this.state;
    const { classList: { currentSelectedClassList } } = this.props;

    // eslint-disable-next-line func-names
    (currentSelectedClassList || []).sort(function (item1, item2) {
      if (item1.gradeEnum === item2.gradeEnum) {
        return item1.classId - item2.classId;
      }
      return item1.gradeEnum - item2.gradeEnum;

    })
    let classCount = 0;
    (currentSelectedClassList || []).forEach(item => {
      classCount += item.classCount;
    })
    return (
      <div className={styles.selectedClass}>
        <div className={styles.classLeft}>
          已选{classCount}个班级：
        </div>
        <div className={styles.classList}>
          {currentSelectedClassList.length > 2 && !isMore ? (
            currentSelectedClassList.slice(0, 2).map(item => {
              return (
                <div className={styles.classItem} key={`${item.gradeEnum}${item.classId}`}>
                  {item.gradeName}{item.className}
                </div>
              )
            })
          ) : (
              currentSelectedClassList.map(item => {
                return (
                  <div className={styles.classItem} key={`${item.gradeEnum}${item.classId}`}>
                    {item.gradeName}{item.className}
                  </div>
                )
              })
            )}

          {currentSelectedClassList.length > 2 && this.isMoreShow()}
          <Icon type="delete" onClick={this.handleClickClear} style={{ marginLeft: '10px' }} />
        </div>
      </div>
    )
  }

  isMoreShow = () => {
    const { isMore } = this.state;
    return (
      isMore ? (
        <span onClick={this.handleClickMore} className={styles.moreOperate}>收起<Icon type="up" /></span>
      ) :
        (
          <span className={styles.moreOperate} onClick={this.handleClickMore}>展开<Icon type="down" /></span>
        )
    )
  }

  handleClickMore = () => {
    const { isMore } = this.state;
    this.setState({
      isMore: !isMore,
    })
  }

  render() {
    const { visible } = this.state;
    const {
      classList: { classList, notMineClassList, selectedId, gradeClassList, currentSelectedClassList }
    } = this.props;
    let newClassList = [];
    let classIdListByHeaderTeacher = [];
    newClassList.push({ className: "班级圈", classId: -1 });
    // 班主任所在班级
    if (classList && classList.length > 0) {
      classIdListByHeaderTeacher = classList.map((item) => {
        newClassList.push({ className: item.className, classId: item.classId })
        return item.classId;
      });
    }
    // 任课班级
    if (notMineClassList && notMineClassList.length > 0) {
      notMineClassList.forEach((item) => {
        if (!classIdListByHeaderTeacher.includes(item.classId)) {
          newClassList = update(newClassList, { $push: [item] });
        }
      });
    }
    return (
      <div>
        <div className={styles.dynamicTitle}>
          {newClassList.map((item) => {
            const { classId, className, gradeName } = item;
            if (classId === -1) {
              return (
                <div
                  key={classId}
                  className={classNames(styles.dynamicTitleItem, {
                    [`${styles.active}`]: selectedId === -1
                  })}
                  onClick={this.handleChangeSelectedClassId.bind(this, classId)}
                >
                  班级圈<Icon type="down" />
                </div>
              )
            }
            return (
              <div
                key={classId}
                className={classNames(styles.dynamicTitleItem, {
                  [`${styles.active}`]: selectedId === classId
                })}
                onClick={this.handleChangeSelectedClassId.bind(this, classId)}
              >
                {gradeName}{className}
              </div>
            )
          })}

          <Drawer
            placement="top"
            // closable={false}
            onClose={this.onClose}
            visible={visible}
            bodyStyle={{ padding: '0' }}
          // style={{top:'80px'}}
          >
            <div>
              <div className={styles.classListLayout}>
                {
                  gradeClassList.map((item) => (
                    <div key={item.gradeName} className={styles.classListItem}>
                      <div className={styles.gradeName}>{item.gradeName}</div>
                      <ClassRow gradeEnum={item.gradeEnum} gradeName={item.gradeName} rowData={item.classList} />
                      {/* {this.rrow(value.gradeEnum, value.classList)} */}
                    </div>
                  ))
                }
              </div>

              <div className={styles.btnLayout}>
                <div
                  className={classNames(styles.btnLayoutItem, styles.btnReset)}
                  onClick={() => this.resetClick()}
                >
                  重置
              </div>
                <div
                  className={classNames(styles.btnLayoutItem, styles.btnComfirm)}
                  onClick={() => this.queryClick()}
                >
                  确定
              </div>
              </div>
            </div>

          </Drawer>
        </div>
        {selectedId === -1 && currentSelectedClassList.length > 0 && this.renderSelectClass()}
      </div>

    )
  }

}

export default MenuBar;