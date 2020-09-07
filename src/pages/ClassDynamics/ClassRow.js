import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { Flex } from 'antd-mobile';
import styles from './ClassRow.less';

@connect(({ classList }) => ({
  classList,
}))
class ClassRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }     

  // mapFindIndex = (mapItem, id) => {
  //   const index = (mapItem || []).findIndex((item) => item.classId === id);
  //   retrun index
  // }






  onClassCheck = (classId, className) => {
    const {
      rowData,
      gradeName,
      gradeEnum,
      classList: { selectedClassList, gradeClassList },
      dispatch,
    } = this.props;
    const classIdList = [];
    // const newSelectedClassList = [...selectedClassList];
    const allClassIndex = selectedClassList.findIndex((item) => item.classId === -1 && item.gradeEnum === gradeEnum);
    const classIndex = selectedClassList.findIndex((item) => item.classId === classId && item.gradeEnum === gradeEnum);
    // 未存入
    
    if (classIndex === -1) {
      if (classId === -1) {
        (rowData || []).forEach((item) => {
          classIdList.push(item.classId)
        })
        const obj = {
          gradeEnum,
          gradeName,
          classId: -1,
          classIdList,
          className: '全班',
          classCount: (rowData || []).length,
        }
        const newSelectedClassList = selectedClassList.filter(item => item.gradeEnum !== gradeEnum)
        newSelectedClassList.push(obj);
        dispatch({
          type: "classList/getSelectedClassList",
          payload: {
            selectedClassList: newSelectedClassList,
          }
        })
      } else {
        const obj = {
          gradeEnum,
          gradeName,
          classId,
          className,
          classCount: 1,
        }
        selectedClassList.push(obj);
        if (allClassIndex > -1) {
          selectedClassList.splice(allClassIndex, 1)
        }
        dispatch({
          type: "classList/getSelectedClassList",
          payload: {
            selectedClassList,
          }
        })
      }
    } else {
      const newSelectedClassList = selectedClassList.filter(item => item.classId !== classId)
      dispatch({
        type: "classList/getSelectedClassList",
        payload: {
          selectedClassList: newSelectedClassList,
        }
      })
    }
  }

  getIsActive = (array, classId, gradeEnum) => {
    const isActive = ((array || []).findIndex(value => value.classId === classId && value.gradeEnum === gradeEnum)) === -1
      ? 'Active'
      : '';
    return isActive
  }

  render() {
    const { classList: { selectedClassList } } = this.props;
    const { rowData, gradeName, gradeEnum } = this.props;

    const isAllActive = this.getIsActive(selectedClassList, -1, gradeEnum);
    return (
      <Flex wrap="wrap">
        <div
          className={classNames(styles.classCheckbox, {
            [`${styles.active}`]: isAllActive > -1
          })}
          onClick={this.onClassCheck.bind(this, -1)}
        >
          全部
        </div>
        {(rowData || []).map((item) => {
          const isActive = this.getIsActive(selectedClassList, item.classId, gradeEnum);
          return (
            <div
              key={item.classId}
              className={classNames(styles.classCheckbox, {
                [`${styles.active}`]: isActive > -1
              })}
              onClick={this.onClassCheck.bind(this, item.classId, item.className)}
            >
              {item.className}
            </div>
          )
        })}
      </Flex>
    )
  }
}

export default ClassRow;