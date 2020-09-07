import React from 'react';
import { NavBar, Icon, TextareaItem, Button, Toast, Modal } from 'antd-mobile';
import router from 'umi/router';
import { connect } from 'dva';
import update from 'react-addons-update';
import nativeApi from '../../utils/nativeApi';
import addImg from '@/assets/add.png';
import myClassImg from '@/assets/myClass.jpg';
import PhotoItem from '@/components/PhotoItem/PhotoItem';
import wxApi from '../../utils/wxApi';
import styles from './index.less';

const { alert } = Modal;

@connect(({ createDynamics, classList }) => ({
  createDynamics,
  classList,
}))
class CreateDynamics extends React.PureComponent {
  state = {
    marginTop: 0,
    publicValue: 0,
    textContent: '',
    pictureList: [
      {
        "fileUuid": "00k0k7n427b631e6fc2450fbc855e2cc3a4c694",
        "fileName": "刘建锋老师",
        "fileSize": "1024"
      },
      {
        "fileUuid": "00k0k7u42770c633bd14264a06b5543b390995d",
        "fileName": "有飞机老师",
        "fileSize": "1024"
      },

    ],
    classIdList: [-1],
    publicClick: false,
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const marginTop = document.getElementById('navContianer').offsetHeight;
    this.setState({ marginTop });
    nativeApi.onBackPressed(() => {
      nativeApi.onBackPressed(null);
      nativeApi.close();
    });
    this.autoFocusInst.focus();
    this.getClassList();
    this.getCurrentSemesterCode();
  }

  componentWillUnmount() {
    this.setState = () => { };
  }

  // 班级Id列表
  onClassCheck(classId) {
    const { classIdList } = this.state;
    // 没有Id
    if (classIdList.indexOf(classId) === -1) {
      const newClassIdList = update(classIdList, { $push: [classId] });
      if (classId === -1) {
        this.setState({
          classIdList: [-1],
        });
      } else {
        const index = classIdList.indexOf(-1);
        // const newClassIdList = update(classIdList, { $splice: [[index, 1]] });
        this.setState({
          classIdList: index > -1 ? update(newClassIdList, { $splice: [[index, 1]] }) : newClassIdList,
        });
      }
    } else {
      const index = classIdList.indexOf(classId);
      const newClassIdList = update(classIdList, { $splice: [[index, 1]] });
      if (classId === -1) {
        this.setState({
          classIdList: [],
        });
      } else {
        this.setState({
          classIdList: newClassIdList,
        });
      }
    }
  }

  // 查询班主任管理班级列表,包含任课班级和班主任管理的班级
  getClassList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'classList/inquireClassesList',
    })
  }

  // 查询当前学期码
  getCurrentSemesterCode = () => {
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
    })
  }

  // 内容填写
  changeContent = (value) => {
    this.setState({
      textContent: value,
    })
  }

  // 发布动态
  createDynamics = () => {
    const { dispatch } = this.props;
    const { textContent, publicValue, classIdList, pictureList } = this.state;
    const pictureSizeList = [];
    const pictureNameList = [];
    const pictureIdList = [];
    (pictureList || []).forEach((photoObj) => {
      pictureIdList.push(photoObj.fileUuid);
      pictureNameList.push(photoObj.fileName || photoObj.filename);
      pictureSizeList.push(photoObj.fileSize);
    });
    if (classIdList.length === 0) {
      Toast.offline('班级不能为空', 1);
      return;
    }

    if (textContent.replace(/(^\s*)|(\s*$)/g, '').replace(/[\r\n]/g, '') === '') {
      Toast.offline('内容不能为空', 1);
      return;
    }
    dispatch({
      type: 'createDynamics/createClassDynamics',
      payload: {
        pictureSizeList,
        pictureNameList,
        pictureIdList,
        classIdList,
        content: textContent,
        type: publicValue,
      }
    }).then(() => {
      Toast.success('发布成功', 1);
      this.setState({
        publicClick: true,
      });
      router.goBack();
    });
  }

  handleDelete = (value) => {
    this.setState(prevState => {
      const { pictureList } = prevState;
      return {
        pictureList: update(pictureList, { $splice: [[value, 1]] })
      }
    })
  }

  // 上传图片
  onUploadImgTouchEnd = () => {
    const { pictureList } = this.state;
    // 为兼容iOS设备limit为0时
    if (9 - pictureList.length === 0) {
      Toast.fail('已达到个数上限');
      return false;
    }
    nativeApi.newSelectImageFileAndCaptureImage(false, (9 - pictureList.length)).then((newpictureList) => {
      this.setState({
        pictureList: pictureList.concat(newpictureList),
      })
    });
  };

  render() {
    const {
      marginTop,
      textContent,
      classIdList,
      publicClick,
      pictureList,
    } = this.state;
    const { classList: { classList, notMineClassList } } = this.props;

    let newClassList = [];
    let classIdListByHeaderTeacher = [];
    newClassList.push({ className: "无", classId: -1 });
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
    const renderClassCheckbox = (newClassList || []).map((item) => {
      const classId = parseInt(item.classId, 10);
      // 元素在数组中的位置，如果没有搜索到则返回 -1。 
      // 按下有颜色
      const isActive = (classIdList.indexOf(classId) !== -1)
        ? '-active'
        : '';
      const grade = item.gradeName ? item.gradeName.substring(0, 1) : item.className.substring(0, 1);
      const className = item.gradeName ? item.className.substring(0, 1) : item.className.substring(3, 4);
      return (
        <div
          onClick={() => this.onClassCheck(parseInt(item.classId, 10))}
          key={item.classId}
          className={styles[`class-checkbox${isActive}`]}
        >
          {item.className === "无" ? "无" : `${grade}（${className}）班`}
          {/* {item.className.replace('年级', '-').replace("班", "")} */}
        </div>
      )
    })

    return (
      <div style={{ backgroundColor: '#FFF' }}>
        <div id="navContianer">
          <NavBar
            mode="dark"
            icon={<Icon
              type="left"
              onClick={() =>
                alert('退出此次编辑？', '', [
                  { text: '取消', onPress: () => console.log('cancel') },
                  { text: '确定', onPress: () => router.goBack() },
                ])
              }
            />}
            onLeftClick={() => {
              if (wxApi.isWeixinBrowser()) {
                router.goBack();
                return;
              }
              nativeApi.close();
            }}
            style={{ backgroundColor: '#199ED8' }}
          >
            发布动态
          </NavBar>
        </div>
        <div style={{ marginTop: `${marginTop}px` }}>
          <div>
            <TextareaItem
              value={textContent}
              style={{ minHeight: '150px' }}
              placeholder="请填写内容"
              data-seed="logId"
              autoHeight
              ref={el => this.autoFocusInst = el}
              onChange={this.changeContent}
            />
          </div>
          {/* 上传照片 */}

          {/* 图片展示 */}
          {(pictureList || []).map((item, index) => {
            return (
              <PhotoItem
                showDelete
                handleDelete={this.handleDelete.bind(this, index)}
                key={item.fileUuid}
                fileName={(item.fileName || item.filename)}
                fileUuid={item.fileUuid}
              />
            )
          })}
          <img
            style={{ height: '60px', margin: '5px', width: '60px' }}
            src={addImg}
            alt="添加图片"
            onTouchEnd={this.onUploadImgTouchEnd}
          />
          <div>
            <div className={styles.line} />
            <div className={styles.classData}>
              <div className={styles.classDataTitle}>
                <img style={{ marginLeft: '-7px' }} src={myClassImg} alt="" />
                归属班级
              </div>
              <div className={styles.classFlow}>
                <div className={styles['publish-job-scroll-content']} style={{ marginBottom: '10px' }}>
                  {renderClassCheckbox}
                  <div className={styles['publish-job-placeholder']} />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ width: '95%', height: '1px', backgroundColor: '#F0F0F0', margin: '0px auto 10px' }}
          />
          <Button
            activeStyle={{ backgroundColor: '#F0F0F0' }}
            className={styles.btn}
            onClick={this.createDynamics}
            disabled={publicClick}
          >
            发布
          </Button>
          <br />
        </div>
      </div>
    );
  }
}

export default CreateDynamics;
