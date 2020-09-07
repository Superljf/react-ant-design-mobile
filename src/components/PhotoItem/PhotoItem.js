import React, { Component } from 'react';
import styles from './PhotoItem.less';
// import ProjectionIcon from "../../components/ProjectionIcon";
import fsUtils from "../../utils/fsUtils";

class PhotoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  preview = (fileUuid, fileName) => {
    fsUtils.gotoFilePreview(fileUuid, fileName);
  };

  handleDelete = (e) => {
    e.stopPropagation();
    const { handleDelete } = this.props;
    handleDelete();
  };

  render() {
    const { customStyle, fileName, fileUuid, showDelete } = this.props;

    return (
      <div className={styles.photoItem} style={{ ...customStyle }} onClick={() => this.preview(fileUuid, fileName)}>
        {showDelete && (
          <div className={styles.deleteButton} onClick={(e) => this.handleDelete(e)}>
            <svg t="1594711121961" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4490" width="16" height="16"><path d="M512 0C228.266667 0 0 228.266667 0 512s228.266667 512 512 512 512-228.266667 512-512-228.266667-512-512-512z" fill="#C0CCDA" p-id="4491"></path><path d="M725.333333 725.333333a34.816 34.816 0 0 1-51.2 0L512 563.2 349.866667 725.333333a34.816 34.816 0 0 1-51.2 0 34.816 34.816 0 0 1 0-51.2L460.8 512 298.666667 349.866667a34.816 34.816 0 0 1 0-51.2 34.816 34.816 0 0 1 51.2 0L512 460.8l162.133333-162.133333a34.816 34.816 0 0 1 51.2 0 34.816 34.816 0 0 1 0 51.2L563.2 512l162.133333 162.133333c19.2 14.933333 19.2 40.533333 0 51.2z" fill="#FFFFFF" p-id="4492"></path></svg>
          </div>
        )
        }
        <div className={styles.photoContent}>
          <img alt='' src={fsUtils.getViewFileAddress(fileUuid)} className={`${styles.profilePhoto}`} height={'60px'} />
        </div>
      </div>
    );
  }
}

export default PhotoItem;

